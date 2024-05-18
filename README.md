# 🌟 Nuxel

![Nuxt.js](https://img.shields.io/badge/Nuxt.js-v3.10.1-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

**Nuxel**: Your pixel-perfect, Dockerized Nuxt.js starter.

## 🚀 Features

- **Dev & Prod Ready**: Multi-stage builds.
- **Easy Config**: Docker Compose.

## 📂 Structure

```bash
.
├── Dockerfile
├── Dockerfile.dev
├── README.md
├── app.config.ts
├── app.vue
├── docker-compose.yml
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── public/
│   └── favicon.ico
├── server/
│   └── tsconfig.json
└── tsconfig.json
```

## 🛠️ Setup

1. **Clone & Init**:
   ```sh
   git clone https://github.com/mmshooreshi/nuxel.git
   cd nuxel
   npx nuxi init -t ui
   ```

2. **Run**:
   ```sh
   docker-compose up --build
   ```

3. **Access**:
   - Dev: [http://localhost:3001](http://localhost:3001)
   - Prod: [http://localhost:3000](http://localhost:3000)

## 📜 License

MIT. See `LICENSE`.

---

Made with ❤️ using Nuxt.js and Docker.