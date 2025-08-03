// index.js
const cheetah = require('../cheetah')();

cheetah.enableLayer('json', { limit: 1024 * 100 }); // 100KB max


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

cheetah.patch('/patch', (req, res) => {
  res.end(`my patch req.`);
})


cheetah.post('/api', (req, res) => {
  res.end(`Received: ${req.body.name}`);
});

const cluster = true
cheetah.listen(3000, { cluster: cluster }, () => {
 // console.log("server started")
});
