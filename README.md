# TV Hub V1

Proyecto con Node.js, Express, TypeScript, MongoDB y Mongoose. TvHub V1 cubre MVC, registro, login, JWT, cookies HttpOnly, sesiones persistentes y autorización por rol. No implementa canales, playlists, búsqueda ni reproducción.

## Requirements

- Node.js 20 o superior
- Docker y Docker Compose

## Installation and environment

```bash
npm install
docker compose up -d
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Un clon nuevo usa `.env.example` automáticamente en desarrollo, por lo que no requiere crear un `.env` para empezar la clase. Si se necesita personalizar la configuración local, crear el archivo ignorado por Git:

```bash
cp .env.example .env
```

Las variables requeridas están documentadas en `.env.example`: `PORT`, `NODE_ENV`, `MONGO_URI`, secretos JWT y los TTL de ambos tokens. En producción se debe proporcionar un `.env` seguro o variables de entorno equivalentes; los secretos de ejemplo no son válidos para producción.

## Commands

```bash
npm run dev
npm run build
npm start
npm test
npm run test:watch
docker compose config
docker compose up -d
```

## Architecture

El flujo es Route → Controller → Mongoose Model → MongoDB. Las rutas aplican middleware; los controladores validan y coordinan; los modelos definen persistencia. El frontend es HTML, CSS y JavaScript vanilla con `fetch` nativo.

## API

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/health`              | Express health check           |
| GET    | `/ready`               | MongoDB readiness check        |
| POST   | `/api/auth/register`   | Creates a USER and signs in    |
| POST   | `/api/auth/login`      | Signs in and creates a session |
| POST   | `/api/auth/refresh`    | Rotates refresh token          |
| POST   | `/api/auth/logout`     | Revokes current session        |
| POST   | `/api/auth/logout-all` | Revokes all user sessions      |
| GET    | `/api/users/me`        | Current authenticated user     |
| GET    | `/api/admin/demo`      | ADMIN-only demonstration       |

Access and refresh tokens are sent as HttpOnly cookies. MongoDB only stores a SHA-256 hash of the refresh token (bcrypt is used for passwords; it truncates long JWT values). Refreshing replaces that hash, so the previous refresh token cannot be reused.

## Exercises

Complete the authentication TODOs.

| TODO | Exercise                                        | Difficulty   |
| ---- | ----------------------------------------------- | ------------ |
| 01   | Implement `login()`                             | Beginner     |
| 02   | Implement the `authenticate` middleware         | Beginner     |
| 03   | Implement the `authorize` middleware            | Beginner     |
| 04   | Implement `logout()`                            | Intermediate |
| 05   | Implement `logoutAll()`                         | Intermediate |
| 06   | Implement refresh-token rotation in `refresh()` | Advanced     |
