// index.js
const cheetah = require('../cheetah')();

cheetah.use((req, res, next) => {
  //console.log(`[${process.pid}] ${req.method} ${req.url}`);
  next();
});

cheetah.get('/', (req, res) => {
  res.end('Hello, ultra-fast world!');
});

cheetah.get('/user/:id', (req, res) => {
  res.end(`User ID: ${req.params.id}`);
});

cheetah.get('/search', (req, res) => {
  res.end(`Query: ${req.query.q || 'none'}`);
});
const cluster = true
cheetah.listen(3000, { cluster: cluster }, () => {
 // console.log("server started")
});
