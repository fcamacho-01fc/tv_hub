# TV Hub V6.5

Aplicación de clase con Node.js, Express, TypeScript, MongoDB/Mongoose y frontend HTML, CSS y JavaScript. Incluye la implementación docente completa de Audit Logs para la sesión 16: eventos REPORT y SECURITY, API de consulta y vistas ADMIN.

## Inicio rápido

Requisitos: Node.js 20 o superior y Docker con Compose.

```bash
npm install
docker compose up -d
npm run build
npm run import:all-channels
npm run dev
```

Abre `http://localhost:3000`. `/health` comprueba el servidor y `/ready` confirma la conexión con MongoDB. En desarrollo se carga `.env.example` si no existe `.env`; copia ese archivo a `.env` para personalizar secretos JWT, MongoDB, correo o el tiempo de escalación.

`npm run import:all-channels` carga las playlists `playlists/*_playlist.m3u` y **reemplaza Channels y Favorites**. Para importar una sola playlist después de compilar:

```bash
npm run import:channels -- playlists/japon_playlist.m3u Japan
```

Otros comandos: `npm test` ejecuta Jest, `npm start` sirve la compilación y `docker compose down` detiene MongoDB sin borrar su volumen.

## Usuarios y acceso

- `POST /api/auth/register` crea una cuenta con rol `USER` e inicia sesión. No hay usuarios ni contraseñas precargados en un clon nuevo.
- `USER` puede ver canales, usar Favorites y crear, consultar, editar o eliminar sus propios Reports según las reglas de estado.
- `ADMIN` puede consultar y cerrar Reports, ver métricas y leer Audit Logs. Los endpoints ADMIN comprueban el rol en el backend.
- Los tokens de acceso y refresh viajan en cookies HttpOnly. Las sesiones se guardan en MongoDB y el refresh rota su token.

Para preparar un ADMIN de desarrollo, registra primero una cuenta y cambia su rol en MongoDB. Sustituye el correo del ejemplo y vuelve a iniciar sesión para obtener un JWT con el rol actualizado:

```bash
docker compose exec mongo mongosh tvhub --eval 'db.users.updateOne({email:"admin@example.com"},{$set:{role:"ADMIN"}})'
```

La cuenta `admin@mail.com` se ha usado en demostraciones locales, pero su existencia depende del volumen conservado; el proyecto no la crea automáticamente.

## Funciones

- **Canales y reproducción:** importación M3U en backend, catálogo por país y categoría, búsqueda, página Country y Watch con Shaka Player.
- **Favorites:** guardar, buscar, ordenar y quitar canales favoritos.
- **Reports:** hasta cinco imágenes de evidencia, edición y eliminación propias, correo de notificación, actualización por Socket.IO y escalación automática de Reports abiertos.
- **Soporte ADMIN:** cola de Reports, cierre administrativo y métricas diarias en `/support-reports.html` y `/support-metrics.html`.
- **Audit Logs:** eventos SECURITY de login, refresh, logout, sesiones y acceso denegado; eventos REPORT al crear, editar, escalar, resolver y eliminar. ADMIN puede consultar logs globales o el historial de un Report.

## API actual

Las rutas protegidas usan las cookies de sesión. `ADMIN` indica que se exige ese rol; `USER` indica cualquier persona autenticada.

| Método | Ruta | Acceso y función |
| --- | --- | --- |
| GET | `/health`, `/ready` | Público; salud del servidor y conexión a MongoDB |
| POST | `/api/auth/register`, `/api/auth/login` | Público; crea cuenta o inicia sesión |
| POST | `/api/auth/refresh`, `/api/auth/logout` | Cookie de refresh; rota token o termina sesión |
| POST | `/api/auth/logout-all` | USER; revoca todas sus sesiones |
| GET | `/api/users/me` | USER; perfil actual |
| GET | `/api/channels`, `/api/channels/:id` | Público; lista o detalle de canal activo |
| GET | `/api/favorites` | USER; favoritos propios |
| POST, DELETE | `/api/favorites/:channelId` | USER; agrega o quita favorito |
| GET, POST | `/api/reports` | USER; lista o crea Report propio |
| PATCH, DELETE | `/api/reports/:id` | USER; edita o elimina Report propio cuando no está resuelto |
| GET | `/api/admin/reports` | ADMIN; cola de Reports |
| PATCH | `/api/admin/reports/:id/close` | ADMIN; resuelve un Report |
| GET | `/api/admin/reports/metrics` | ADMIN; métricas de atención |
| GET | `/api/admin/reports/:reportId/logs` | ADMIN; historial de un Report |
| GET | `/api/admin/logs` | ADMIN; logs globales con filtros, búsqueda y orden por fecha |
| GET | `/api/admin/demo` | ADMIN; endpoint de demostración de roles |

`GET /api/channels` acepta `search`, `category`, `country` y `sort=country`. Las listas de Reports aceptan `filter=open|closed|all`; las métricas aceptan `days`. `POST /api/reports` recibe `multipart/form-data` con `channelId`, `reason`, `description` y hasta cinco archivos `evidence`. `GET /api/admin/logs` acepta `category`, `action`, `actorType`, `resourceType`, `resourceId`, `sessionId`, `search`, `sort=createdAt`, `order=asc|desc`, `page` y `limit`.

## Material de sesión 16

El flujo docente muestra cada cambio de Report seguido por su Audit Log y después por el correo o evento WebSocket existente. La rama `tv-hub-v6.5-logs-base` contiene el starter para live coding, con cinco integraciones REPORT pendientes y la auditoría SECURITY completa. El material local de `docs/` queda excluido de Git.
