# TV Hub — AGENTS.md
Educational readability is more important than enterprise-style abstraction.
Backend code should be understandable by students with basic knowledge of Express, TypeScript, Mongoose and async/await.

Avoid introducing additional architectural layers unless the course explicitly reaches that topic.

## Propósito
TV Hub es un proyecto universitario de Backend para enseñar Node.js, Express, TypeScript, MVC, MongoDB, Mongoose, Docker, autenticación, autorización, JWT, refresh tokens, persistencia de sesiones, APIs REST y testing.

La versión actual es **V1 — MVC + Authentication + Authorization**.

Antes de modificar código:
1. Lee este `AGENTS.md`.
2. Lee `docs/requerimientos-v1.md`.
3. Inspecciona el repositorio.
4. Respeta estrictamente el alcance de V1.
5. No implementes funcionalidades de V2 o V3.

## Filosofía educativa
Prioriza:
- claridad;
- legibilidad;
- separación de responsabilidades;
- facilidad para explicar el código en clase;
- buenas prácticas reales sin sobrearquitectura.

Prefiere código explícito y didáctico sobre abstracciones innecesarias.

## Stack obligatorio
Usar:
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Docker / Docker Compose
- JWT
- bcryptjs
- cookies HttpOnly
- Jest
- Supertest

Puede usarse Zod u otra librería ligera de validación si simplifica el código.

No utilizar NestJS, Prisma, TypeORM, Sequelize, Next.js, React, Angular o Vue salvo instrucción posterior explícita.

## TypeScript
Usar TypeScript estricto:

```json
{
  "strict": true
}
```

Evitar `any` siempre que sea razonablemente posible.

## Arquitectura
V1 debe enseñar MVC de forma clara.

Flujo:

```text
HTTP Request
    ↓
Route
    ↓
Controller
    ↓
Mongoose Model
    ↓
MongoDB
```

La View corresponde al frontend simple servido por Express:

```text
HTML + CSS + JavaScript vanilla
```

No convertir V1 en Layered Architecture. No agregar `Service` o `Repository` salvo que exista una razón técnica concreta y documentada.

## Responsabilidades

### Routes
- Definir endpoints.
- Aplicar middleware.
- Delegar al Controller.
- No contener lógica de negocio.

### Controllers
- Leer request.
- Validar datos.
- Coordinar operaciones.
- Usar Mongoose Models.
- Construir response.

### Models
- Definir Schema.
- Tipos.
- Restricciones.
- Índices.
- Timestamps.
- Validaciones de persistencia.

### Middleware
Responsabilidades transversales:
- autenticación;
- autorización;
- manejo de errores.

## Estructura recomendada

```text
src/
├── app.ts
├── server.ts
├── config/
│   ├── env.ts
│   └── database.ts
├── controllers/
│   ├── auth.controller.ts
│   └── user.controller.ts
├── models/
│   ├── user.model.ts
│   └── session.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── health.routes.ts
├── middleware/
│   ├── authenticate.middleware.ts
│   ├── authorize.middleware.ts
│   └── error.middleware.ts
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   └── cookies.ts
├── types/
│   └── express.d.ts
└── public/
    ├── login.html
    ├── register.html
    ├── index.html
    ├── css/
    └── js/
```

Puede ajustarse ligeramente si hay una razón clara.

## MongoDB
- MongoDB debe ejecutarse en Docker.
- Mongoose es el ODM oficial.
- Configurar conexión mediante `MONGO_URI`.
- No hardcodear credenciales.
- Usar volumen persistente.
- Docker Compose debe incluir healthcheck.

## Contraseñas
- Nunca guardar contraseñas en texto plano.
- Usar `bcryptjs`.
- Persistir solamente `passwordHash`.
- Nunca devolver `passwordHash` por API.

## Access Token
- JWT de corta duración.
- TTL recomendado: 15 minutos.
- Configurable por environment.
- Payload mínimo:

```json
{
  "sub": "userId",
  "role": "USER"
}
```

No incluir datos sensibles.

## Refresh Token
- Mayor duración que Access Token.
- TTL recomendado: 7 días.
- Debe permitir revocación y rotación.
- Nunca almacenar el refresh token original en MongoDB.
- Persistir solamente `refreshTokenHash`.

## Sesiones persistentes
Usar colección `sessions`.

Una Session debe estar vinculada a un User y permitir:
- múltiples dispositivos;
- logout;
- logout global;
- revocación;
- rotación de refresh token.

## Refresh Token Rotation

```text
Refresh Token A
    ↓
validar
    ↓
crear Access Token nuevo
    ↓
crear Refresh Token B
    ↓
reemplazar hash de A por hash de B
```

El token A no debe volver a ser válido.

## Cookies
Usar cookies HttpOnly.

Desarrollo:
```text
HttpOnly = true
SameSite = lax
Secure = false
```

Producción:
```text
HttpOnly = true
Secure = true
```

Nunca guardar refresh tokens en `localStorage`.

## Authorization
Roles iniciales:

```text
USER
ADMIN
```

Patrón:

```ts
authenticate
authorize("ADMIN")
controller
```

Mantener clara la diferencia:
- Authentication: ¿quién eres?
- Authorization: ¿qué puedes hacer?

## Errores
Usar respuestas consistentes:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

No exponer secretos, hashes, stack traces ni detalles internos.

## Variables de entorno
Crear `.env.example`.

Esperadas:

```text
PORT
NODE_ENV
MONGO_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_TTL
REFRESH_TOKEN_TTL
```

Nunca versionar `.env`.

## Health checks
Implementar:

```http
GET /health
GET /ready
```

`/health` verifica Express.
`/ready` verifica que MongoDB esté conectado.

## Frontend V1
Usar HTML + CSS + JS vanilla.

Debe incluir:
- Register
- Login
- Home

Home debe mostrar placeholders de V2:

```text
TV HUB

Search        [Coming in V2]
Categories    [Coming in V2]
Channels      [Coming in V2]
Favorites     [Coming in V2]
```

## Versionado conceptual

```text
V0 — Infrastructure
V1 — MVC + Authentication + Authorization
V2 — Integrative Practice Starter
V3 — Reference Solution
```

## Fuera de alcance de V1
NO implementar todavía:
- PlaylistSource;
- importación de playlists;
- parser M3U;
- M3U8;
- Channel Model;
- listado de canales;
- búsqueda;
- filtros;
- categorías;
- ordenamiento;
- paginación;
- reproducción HLS;
- favoritos;
- FavoriteList;
- ChannelRepository;
- funcionalidades de la Práctica Integradora 1.

## Testing
Usar Jest + Supertest.

Cubrir al menos:
- health;
- register;
- login;
- acceso no autenticado;
- acceso autenticado;
- autorización por rol;
- refresh;
- logout.

Los tests deben ser claros y educativos.

## Scripts esperados

```bash
npm run dev
npm run build
npm start
npm test
npm run test:watch
```

## README
Mantener README con:
- Requirements
- Installation
- Environment variables
- Docker
- Run application
- Run tests
- API endpoints
- Architecture

## Regla de simplicidad
Si existen varias soluciones válidas, preferir la que sea:
- segura;
- explícita;
- pequeña;
- fácil de explicar;
- fácil de depurar;
- adecuada para estudiantes.

## Definition of Done
Antes de terminar:

```bash
npm install
npm run build
npm test
docker compose config
docker compose up -d
```

La aplicación debe iniciar correctamente y:

```http
GET /health
GET /ready
```

deben responder como se espera.

Nunca declarar la tarea terminada sin validar estos puntos.
