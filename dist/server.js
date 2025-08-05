import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import cluster from 'cluster';
import os from 'os';
export class CheetahServer {
    routes = {
        GET: [],
        POST: [],
        PUT: [],
        PATCH: []
    };
    middlewares = [];
    port = 0;
    options = {};
    onListen;
    use(fn) {
        this.middlewares.push(fn);
    }
    get(path, handler) {
        this.routes.GET.push({ path, handler });
    }
    post(path, handler) {
        this.routes.POST.push({ path, handler });
    }
    put(path, handler) {
        this.routes.PUT.push({ path, handler });
    }
    patch(path, handler) {
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
    findRoute(method, pathname, req) {
        const methodRoutes = this.routes[method];
        if (!methodRoutes)
            return;
        for (const { path, handler } of methodRoutes) {
            const pathParts = path.split('/');
            const reqParts = pathname.split('/');
            if (pathParts.length !== reqParts.length)
                continue;
            const params = {};
            let matched = true;
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i].startsWith(':')) {
                    params[pathParts[i].slice(1)] = reqParts[i];
                }
                else if (pathParts[i] !== reqParts[i]) {
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
    handle(req, res) {
        const parsed = parse(req.url || '', true);
        req.query = (typeof parsed.query === 'object' ? parsed.query : {});
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
    startWorker() {
        const server = http.createServer((req, res) => {
            const typedReq = req;
            const typedRes = res;
            // Patch res methods
            typedRes.json = function (data) {
                const body = JSON.stringify(data);
                typedRes.setHeader('Content-Type', 'application/json');
                typedRes.setHeader('Content-Length', Buffer.byteLength(body));
                typedRes.end(body);
            };
            typedRes.status = function (code) {
                typedRes.statusCode = code;
                return typedRes;
            };
            this.handle(typedReq, typedRes);
        });
        server.listen(this.port, () => {
            if (this.onListen)
                this.onListen();
            console.log(`Worker ${process.pid} listening on port ${this.port}`);
        });
    }
    listen(port, arg2, arg3) {
        this.port = port;
        if (typeof arg2 === 'function') {
            this.options = {};
            this.onListen = arg2;
        }
        else {
            this.options = arg2 || {};
            this.onListen = arg3;
        }
        const enableCluster = this.options.cluster === true;
        if (enableCluster && cluster.isPrimary) {
            const cpuCount = os.cpus().length;
            for (let i = 0; i < cpuCount; i++) {
                cluster.fork();
            }
            if (this.onListen)
                this.onListen(); // optional
        }
        else {
            this.startWorker();
        }
    }
}
