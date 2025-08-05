import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import cluster from 'cluster';
import os from 'os';


import type { CheetahRequest, CheetahResponse, Middleware, Handler, ServerOptions } from './types.js';

interface Route {
  path: string;
  handler: Handler;
}

interface RouteMap {
  GET: Route[];
  POST: Route[];
  PUT: Route[];
  PATCH: Route[];
}

export class CheetahServer {
  private routes: RouteMap = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: []
  };

  private middlewares: Middleware[] = [];
  private port: number = 0;
  private options: ServerOptions = {};
  private onListen?: () => void;

  use(fn: Middleware): void {
    this.middlewares.push(fn);
  }

  get(path: string, handler: Handler): void {
    this.routes.GET.push({ path, handler });
  }

  post(path: string, handler: Handler): void {
    this.routes.POST.push({ path, handler });
  }

  put(path: string, handler: Handler): void {
    this.routes.PUT.push({ path, handler });
  }

  patch(path: string, handler: Handler): void {
    this.routes.PATCH.push({ path, handler });
  }

  // enableLayer(name: string, options: any = {}) {
  //   const layers: Record<string, (options: any) => Middleware> = {
  //     json: require('./layers/jsonParser'),
  //     urlencoded: require('./layers/urlencoded'),
  //     jwt: require('./layers/jwt')
  //     // static, rate-limit, etc. can be added
  //   };

  //   const layer = layers[name];
  //   if (layer) {
  //     this.use(layer(options));
  //   } else {
  //     throw new Error(`Unknown layer: ${name}`);
  //   }
  // }

  private findRoute(method: string, pathname: string, req: CheetahRequest): Handler | undefined {
    const methodRoutes = this.routes[method as keyof RouteMap];
    if (!methodRoutes) return;

    for (const { path, handler } of methodRoutes) {
      const pathParts = path.split('/');
      const reqParts = pathname.split('/');

      if (pathParts.length !== reqParts.length) continue;

      const params: Record<string, string> = {};
      let matched = true;

      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].startsWith(':')) {
          params[pathParts[i].slice(1)] = reqParts[i];
        } else if (pathParts[i] !== reqParts[i]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        req.params = params;
        return handler;
      }
    }
  }

  private handle(req: CheetahRequest, res: CheetahResponse): void {
    const parsed = parse(req.url || '', true);
    req.query = (typeof parsed.query === 'object' ? parsed.query : {}) as Record<string, string | string[]>;
    const pathname = parsed.pathname || '/';
    const method = req.method || 'GET';

    let i = 0;

    const next = () => {
      if (i < this.middlewares.length) {
        return this.middlewares[i++](req, res, next);
      }

      const routeHandler = this.findRoute(method, pathname, req);
      if (routeHandler) {
        return routeHandler(req, res);
      }

      res.statusCode = 404;
      res.end('Not Found');
    };

    next();
  }

  private startWorker(): void {
    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
      const typedReq = req as CheetahRequest;
      const typedRes = res as CheetahResponse;

      // Patch res methods
      typedRes.json = function (data: any) {
        const body = JSON.stringify(data);
        typedRes.setHeader('Content-Type', 'application/json');
        typedRes.setHeader('Content-Length', Buffer.byteLength(body));
        typedRes.end(body);
      };

      typedRes.status = function (code: number) {
        typedRes.statusCode = code;
        return typedRes;
      };

      this.handle(typedReq, typedRes);
    });

    server.listen(this.port, () => {
      if (this.onListen) this.onListen();
      console.log(`Worker ${process.pid} listening on port ${this.port}`);
    });
  }
  listen(port: number): void;
  listen(port: number, cb: () => void): void;
  listen(port: number, options: ServerOptions, cb?: () => void): void;

  listen(port: number, arg2?: ServerOptions | (() => void), arg3?: () => void): void {
   this.port = port;

  if (typeof arg2 === 'function') {
    this.options = {};
    this.onListen = arg2;
  } else {
    this.options = arg2 || {};
    this.onListen = arg3;
  }

  const enableCluster = this.options.cluster === true;

  if (enableCluster && cluster.isPrimary) {
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }
    if (this.onListen) this.onListen(); // optional
  } else {
    this.startWorker();
  }
  }
}
