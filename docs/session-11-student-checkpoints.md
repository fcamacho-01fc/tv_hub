# Session 11 — TV Hub V2 student checkpoints

## Status

The instructor version of V2 is working. Student exercises have not been added yet, so this document intentionally contains no TODOs or incomplete code.

## V2 map for the upcoming session

```text
MongoDB
→ src/models/channel.model.ts
→ src/controllers/channel.controller.ts
→ src/routes/channel.routes.ts
→ GET /api/channels
→ src/public/js/home.js
→ channel cards in src/public/index.html
```

## Current classroom baseline

- Authentication, sessions, refresh tokens and authorization from V1 remain available.
- `Channel` stores local sample data in MongoDB.
- `npm run seed:channels` loads the classroom sample channels.
- `GET /api/channels` returns active channels and supports simple search, category, country and sort parameters.
- The Home page loads channel cards with vanilla JavaScript.

Future checkpoints must stay small, use working instructor code as the starting point, and include the edited file, expected result, difficulty and a short hint.
