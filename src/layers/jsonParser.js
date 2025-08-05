function jsonParser({ limit = 1e6 } = {}) {
  return function (req, res, next) {
    const method = req.method;
    if (!['POST', 'PUT', 'PATCH'].includes(method)) return next();

    const contentType = req.headers?.['content-type'] || '';
    if (!contentType.startsWith('application/json')) return next();

    const contentLength = parseInt(req.headers['content-length'], 10);
    if (!contentLength || contentLength === 0) {
      req.body = {};
      return next();
    }

    const chunks = [];
    let received = 0;

    req.on('data', chunk => {
      received += chunk.length;
      if (received > limit) {
        res.statusCode = 413;
        return res.end('Payload too large');
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        req.body = JSON.parse(buffer.toString('utf8') || '{}');
        next();
      } catch {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  };
}

module.exports = jsonParser;
