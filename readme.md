# 🐆 Cheetah — Ultra-Fast Minimal Web Framework for Node.js

**Cheetah** is a blazing-fast, low-overhead HTTP framework for Node.js.
It’s built to be minimal and modular, with **zero dependencies** by default and optional "layers" for JSON, JWT, forms, etc.

> ⚠️ **Not production-ready. Not yet published on npm.**
> Use locally for experiments, prototyping, and performance benchmarks.

---

## 🚀 Why Cheetah?

### Philosophy

Cheetah will always be:

* **Minimal at the core** — no built-in features unless explicitly enabled

* **Zero-dependency** — no third-party packages in the core

* **Modular by design** — add features via optional layers only when needed

* ⚡ **Fast** — 180k+ req/sec without any middleware

* 🧱 **Tiny** — no external deps, no hidden work

* 🧹 **Modular** — add only the features you need

* 🔬 **Benchmark-friendly** — ideal for head-to-head comparisons

* 🧠 **Clean API** — similar to Express, but faster

---

## 📦 Install (Local Usage)

Clone or copy Cheetah into your project (e.g., `./cheetah`)
Then install via local path:

```bash
npm install ./cheetah
```

Or if using `require()` directly:

```js
const cheetah = require('./cheetah');
const app = cheetah();
```

---

## ✨ Quick Start

```js
const cheetah = require('./cheetah');
const app = cheetah();

app.get('/', (req, res) => {
  res.json({ msg: 'Hello from Cheetah!' });
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
```

---

## 🔌 Optional Layers

Cheetah includes opt-in middleware layers:

### Enable JSON body parsing

```js
app.enableLayer('json');
```

### Enable URL-encoded form parsing

```js
app.enableLayer('urlencoded');
```

### Enable JWT auth

```js
app.enableLayer('jwt', { secret: 'super-secret' });
```

---

## 🧪 Performance (M1, local)

### Framework Benchmark Comparison

| Framework   | Avg Req/sec | Notes                       |
| ----------- | ----------- | --------------------------- |
| **Cheetah** | \~179,000   | Local benchmark (no layers) |
| Fastify     | \~45,281    | Official Fastify benchmark  |
| Koa         | \~34,214    | Fastify chart comparison    |
| Restify     | \~34,958    | From Fastify benchmarks     |
| Hapi        | \~31,852    | Same source                 |
| Express     | \~10,278    | Fastify vs others           |

> All non‑Cheetah results are from the official Fastify benchmarks ([https://fastify.dev/benchmarks](https://fastify.dev/benchmarks)). Cheetah’s benchmark measured locally on Apple M1 using `autocannon -c 100 -d 30 -p 10`.

```bash
autocannon -c 100 -d 30 -p 10 http://localhost:3000/
```

> \~180,000 requests/sec (no layers)

### Sample Output:

```
Running 30s test @ http://localhost:3000/
100 connections with 10 pipelining factor

📊 Latency:
┌─────────┌──────┌──────┌───────┌───────┌─────────┌─────────┌───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼───────┤
│ Latency │ 4 ms │ 5 ms │ 10 ms │ 10 ms │ 5.26 ms │ 1.76 ms │ 95 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴───────┘

📊 Throughput:
┌───────────┌─────────┌─────────┌─────────┌─────────┌─────────┌───────────┌─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev     │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┼─────────┤
│ Req/Sec   │ 115,903 │ 115,903 │ 183,935 │ 185,983 │ 179,088 │ 15,031.98 │ 115,881 │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┼─────────┤
│ Bytes/Sec │ 17 MB   │ 17 MB   │ 27 MB   │ 27.3 MB │ 26.3 MB │ 2.21 MB   │ 17 MB   │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┴─────────┘

5374k requests in 30.08s, 790 MB read
```

---

## 📁 Project Structure

```
cheetah/
├── index.js              # Entry point
├── server.js             # CheetahServer class
├── layers/
│   ├── jsonParser.js
│   ├── urlencoded.js
│   ├── jwt.js
│   └── ... (optional)
```

---

## 📌 Status

| Feature                | Status         |
| ---------------------- | -------------- |
| Core routing           | ✅ Done         |
| Middleware             | ✅ Done         |
| JSON parser            | ✅ Done         |
| JWT                    | ✅ Done         |
| URL-encoded            | ✅ Done         |
| CORS/static/rate limit | 🚧 In progress |
| TypeScript types       | ❌ Not yet      |
| CLI                    | ❌ Not yet      |
| NPM publish            | ❌ Not yet      |

---

## 🧠 License & Credits

MIT License
Made by \[Krishnadas] for experiments and speed ❤️
