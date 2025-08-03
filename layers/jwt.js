const crypto = require('crypto');

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString();
}

function verifyHMAC(payload, secret, signature) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return hmac === signature;
}

module.exports = function jwtMiddleware(options = {}) {
  const { secret = '', required = false } = options;

  return function (req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      if (required) {
        res.statusCode = 401;
        return res.end('Missing or invalid Authorization header');
      }
      return next();
    }

    const token = auth.slice(7); // strip "Bearer "
    const parts = token.split('.');
    if (parts.length !== 3) {
      if (required) {
        res.statusCode = 401;
        return res.end('Invalid JWT format');
      }
      return next();
    }

    const [headerB64, payloadB64, signature] = parts;
    const verified = verifyHMAC(`${headerB64}.${payloadB64}`, secret, signature);

    if (!verified) {
      if (required) {
        res.statusCode = 401;
        return res.end('Invalid token signature');
      }
      return next();
    }

    try {
      const payloadJSON = base64urlDecode(payloadB64);
      req.user = JSON.parse(payloadJSON);
    } catch (e) {
      if (required) {
        res.statusCode = 400;
        return res.end('Invalid token payload');
      }
    }

    next();
  };
};
