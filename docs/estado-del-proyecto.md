# Estado del proyecto — TV Hub

Última actualización: 17 de septiembre de 2026.

Este documento permite retomar el trabajo aunque cambie la sesión de Codex o se cierre la terminal.

## Rama actual y decisión pendiente

- Rama principal actual: `master`.
- `master` conserva la base original de V1 y no tiene las variantes de V2 fusionadas.
- Por ahora no se debe hacer merge automáticamente. La decisión de fusionar queda pendiente para después de clase.
- Al crear este documento, Express y MongoDB están detenidos.

## Ramas locales disponibles

| Rama | Commit principal | Contenido |
| --- | --- | --- |
| `master` | — | Base V1: autenticación, autorización, sesiones, health checks y frontend básico. |
| `tv-hub-v2-b` | `f4d8e76` | V2 de canales: Model, API, seed, tarjetas, búsqueda e importador M3U local. |
| `tv-hub-v2-b-ui-alt` | `fbb6139` | Todo lo de `tv-hub-v2-b` más una interfaz azul oscura alternativa con filas por categoría. |

## Qué contiene `tv-hub-v2-b`

El flujo V2 queda explícito y conserva MVC:

```text
MongoDB
→ Channel model
→ GET /api/channels
→ channel controller
→ JSON
→ frontend vanilla JavaScript
→ tarjetas de canales
```

Incluye:

- `Channel` con `name`, `logoUrl`, `streamUrl`, `country`, `categories` e `isActive`.
- `GET /api/channels`, con búsqueda y filtros simples.
- `npm run seed:channels` para cargar 20 canales de ejemplo locales.
- `npm run import:m3u -- <archivo> <país>` para importar playlists M3U locales.
- Documentación de checkpoints V2 y de importación M3U.
- Tests de autenticación, health, channels y parser M3U.

## Importación de playlist M3U

El archivo `docs/argentina_playlist.m3u` fue agregado localmente por el usuario y está ignorado por Git. No se comparte automáticamente al clonar o cambiar de computadora.

En la rama `tv-hub-v2-b` o `tv-hub-v2-b-ui-alt`, el comando es:

```bash
npm run build
npm run import:m3u -- docs/argentina_playlist.m3u Argentina
```

La prueba realizada importó 176 canales de Argentina. El importador reemplaza solamente los canales cuyo campo `country` coincide con el país proporcionado; no borra los otros países.

No descarga playlists desde Internet, no prueba URLs de streams y no reproduce video. Las URLs se almacenan solo como datos para versiones futuras.

## Interfaz alternativa

La rama `tv-hub-v2-b-ui-alt` cambia solamente la vista principal:

- aspecto oscuro con contraste azul;
- barra lateral y buscador prominente;
- filas de hasta seis canales;
- colecciones basadas en categorías M3U: News, General, Music, Entertainment, Sports y Movies;
- resultados de búsqueda separados de las colecciones.

No cambia los modelos, rutas, controladores ni autenticación.

## Cómo ejecutar una variante

```bash
git switch tv-hub-v2-b-ui-alt
docker compose up -d
npm run dev
```

Abrir `http://localhost:3000` y registrarse o iniciar sesión.

Para detener todo:

```bash
# En la terminal donde corre npm run dev: Ctrl+C
docker compose down
```

El volumen de Docker conserva los datos de MongoDB aunque se use `docker compose down`.

## Validación realizada

En `tv-hub-v2-b` y antes de crear la UI alternativa:

```text
npm run build      ✓
npm test           ✓ 4 suites, 11 tests
docker compose config ✓
Importación Argentina ✓ 176 canales
GET /api/channels?search=Noticias ✓
```

## Posible merge futuro

Cuando se decida conservar la interfaz alternativa, partir desde `master` y revisar antes de fusionar:

```bash
git switch master
git log --oneline --all --decorate
git diff master..tv-hub-v2-b-ui-alt
```

Después de revisar y probar, el merge propuesto sería:

```bash
git merge --no-ff tv-hub-v2-b-ui-alt
```

No ejecutar ese merge sin una decisión explícita del docente o responsable del proyecto.
