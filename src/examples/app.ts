import  cheetah from '../index.js';
import type { CheetahRequest, CheetahResponse, NextFunction } from '../types.js';

const app = cheetah()
// app.use((req: CheetahRequest, res: CheetahResponse, next: NextFunction) => {
//   console.log(`[${process.pid}] ${req.method} ${req.url}`);
//   next();
// });

app.get('/', (req: CheetahRequest, res: CheetahResponse) => {
  //res.json({ msg: 'Hello from Cheetah!' });
  res.end("hi")
});

app.listen(3000, {cluster: true}, () => {
  //console.log('Server running on http://localhost:3000');
});
