// tiny-server.js
const http = require('http');
const url = require('url');
const cluster = require('cluster');
const os = require('os');

class CheetahServer {
  constructor() {
    this.routes = { GET: [], POST: [], PATCH: [], PUT: [] };
    this.middlewares = [];
    this.port = null;
    this.options = {};
    this.onListen = null;
  }

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
    this.routes.POST.push({ path, handler });
  }

  patch(path, handler) {
    this.routes.POST.push({ path, handler });
  }
  enableLayer(name, options = {}) {
    const layers = {
      json: require('./layers/jsonParser.js'),
      // jwt: require('./layers/jwt'),
      // rps: require('./layers/rps'),
      // static: require('./layers/static')
    };

    if (layers[name]) {
      this.use(layers[name](options));
    } else {
      throw new Error(`Unknown layer: ${name}`);
    }
  }

  findRoute(method, pathname, req) {
    const routes = this.routes[method];
    if (!routes) return;

    for (const { path, handler } of routes) {
      const pathParts = path.split('/');
      const reqParts = pathname.split('/');

      if (pathParts.length !== reqParts.length) continue;

      let params = {};
      let match = true;

      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].startsWith(':')) {
          params[pathParts[i].slice(1)] = reqParts[i];
        } else if (pathParts[i] !== reqParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        req.params = params;
        return handler;
      }
    }
  }

  handle(req, res) {
    const { pathname, query } = url.parse(req.url, true);
    req.query = query;
    const method = req.method;
    let i = 0;

    const next = () => {
      if (i < this.middlewares.length) {
        return this.middlewares[i++](req, res, next);
      }
      const routeHandler = this.findRoute(method, pathname, req);
      if (routeHandler) return routeHandler(req, res);
      res.statusCode = 404;
      res.end('Not Found');
    };

    next();
  }

  _startWorker() {
  const server = http.createServer((req, res) => {
    // Patch res with .json()
    res.json = function (data) {
      const body = JSON.stringify(data);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.end(body);
    };

    // ✅ Fix: preserve outer this context
    this.handle(req, res);
  });

  server.listen(this.port, () => {
    if (this.onListen) this.onListen();
    console.log(`Worker ${process.pid} listening on port ${this.port}`);
  });
}

  listen(port, options = {}, cb) {
    this.port = port;
    this.options = options;
    this.onListen = cb;
    const enableCluster = options.cluster === true;

    if (enableCluster && cluster.isPrimary) {
      const cpuCount = os.cpus().length;
      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }
      if (cb) cb(); // call once in master (optional)
    } else {
      this._startWorker();
    }
  }
}

module.exports.CheetahServer = CheetahServer;

