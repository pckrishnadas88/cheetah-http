// index.js
const { CheetahServer } = require('../cheetah');
const app = new CheetahServer();
app.get('/', (req, res) => {
  res.end('Hello, ultra-fast world!');
});


const cluster = true
app.listen(3000, { cluster: cluster }, () => {
 // console.log("server started")
});
