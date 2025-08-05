// use this script to generate token for testing
// Authorization: Bearer <token>
const crypto = require('crypto');

// use the same key in app.js
const secret = 'super-secret-key';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({ id: 123, name: 'Krish' }));
const signature = crypto
  .createHmac('sha256', secret)
  .update(`${header}.${payload}`)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

const token = `${header}.${payload}.${signature}`;
console.log(token);
