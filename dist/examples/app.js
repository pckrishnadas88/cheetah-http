import cheetah from '../index.js';
const app = cheetah();
// app.use((req: CheetahRequest, res: CheetahResponse, next: NextFunction) => {
//   console.log(`[${process.pid}] ${req.method} ${req.url}`);
//   next();
// });
app.get('/', (req, res) => {
    //res.json({ msg: 'Hello from Cheetah!' });
    res.end("hi");
});
app.listen(3000, { cluster: true }, () => {
    //console.log('Server running on http://localhost:3000');
});
