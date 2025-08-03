# 🐆 Cheetah — Ultra-Fast Minimal Web Framework for Node.js

**Cheetah** is a blazing-fast, low-overhead HTTP framework for Node.js.
It’s built to be minimal and modular, with **zero dependencies** by default and optional "layers" for JSON, JWT, forms, etc.

> ⚠️ **Not production-ready. Not yet published on npm.**
> Use locally for experiments, prototyping, and performance benchmarks.

---

## ✨ Philosophy

Cheetah will always be:

* **Minimal at the core** — no built-in features unless explicitly enabled

* **Zero-dependency** — no third-party packages in the core

* **Modular by design** — add features via optional layers only when needed

* ⚡ **Fast** — 63k+ req/sec

* 🧱 **Tiny** — no external deps, no hidden work

* 🚹 **Modular** — add only the features you need

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
const { CheetahServer } = require('../cheetah');
const app = new CheetahServer();

```

---

## ✨ Quick Start

```js
const { CheetahServer } = require('../cheetah');
const app = new CheetahServer();

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

## 🧪 Performance Benchmarks

### No Clustering (Dell Vostro i5, 100 connections)

| Framework   | Avg Req/sec | Latency (avg) | Notes                  |
| ----------- | ----------- | ------------- | ---------------------- |
| **Cheetah** | **63,179**  | **1.13 ms**   | Minimal core `/` route |
| Fastify     | 53,013      | 1.33 ms       | Same route `/`         |
| Express     | 9,970       | 9.51 ms       | Minimal route handler  |

> Benchmarked using:
> `autocannon -c 100 -d 10 http://localhost:3000/`

### With Clustering (Dell Vostro i5, 100 connections)

| Framework   | Avg Req/sec | Latency (avg) | Notes                |
| ----------- | ----------- | ------------- | -------------------- |
| **Cheetah** | **42,372**  | **1.87 ms**   | Cluster mode enabled |

> `autocannon -c 100 -d 10 http://localhost:3000/`

### 📉 Why Lower with Clustering?

* Your machine likely has limited cores (e.g., 4), which limits parallelism
* IPC (inter-process communication) adds overhead
* If load balancing is uneven, some workers are underutilized
* For very fast handlers, clustering may **not** improve performance — can even slow it slightly

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
| CORS/static/rate limit | ⚠️ In progress |
| TypeScript types       | ❌ Not yet      |
| CLI                    | ❌ Not yet      |
| NPM publish            | ❌ Not yet      |

---

## 🧠 License & Credits

MIT License
Made by Krishnadas for experiments and speed ❤️
