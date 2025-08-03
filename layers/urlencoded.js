const querystring = require('querystring');

module.exports = function urlencodedParser(options = {}) {
  const limit = options.limit || 1e6; // 1MB

  return function (req, res, next) {
    const method = req.method;
    const contentType = req.headers['content-type'] || '';

    if (
      method !== 'POST' &&
      method !== 'PUT' &&
      method !== 'PATCH'
    ) {
      return next();
    }

    if (!contentType.includes('application/x-www-form-urlencoded')) {
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
        const decoded = buffer.toString('utf8');
        req.body = querystring.parse(decoded);
        next();
      } catch (err) {
        res.statusCode = 400;
        res.end('Invalid URL-encoded body');
      }
    });

    req.on('error', () => {
      res.statusCode = 400;
      res.end('Request error');
    });
  };
};
