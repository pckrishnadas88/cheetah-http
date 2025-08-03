// index.js
const { CheetahServer } = require('../cheetah');
const app = new CheetahServer();


app.enableLayer('json', { limit: 1024 * 100 }); // 100KB max
app.enableLayer('urlencoded');


app.use((req, res, next) => {
  //console.log(`[${process.pid}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.end('Hello, ultra-fast world!');
});

app.get('/user/:id', (req, res) => {
  res.end(`User ID: ${req.params.id}`);
});

app.get('/search', (req, res) => {
  res.end(`Query: ${req.query.q || 'none'}`);
});

app.patch('/patch', (req, res) => {
  res.end(`my patch req.`);
})


app.post('/api', (req, res) => {
  res.json({ hello: req.body?.name || 'world' });
});
//url encoded
app.post('/form', (req, res) => {
  res.json({ data: req.body });
});

const cluster = true
app.listen(3000, { cluster: cluster }, () => {
 // console.log("server started")
});
