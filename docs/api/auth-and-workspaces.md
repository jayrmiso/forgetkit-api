# Auth And Workspaces API

Swagger UI is served by the API at `/docs`. The raw OpenAPI document is available at `/openapi.json`.

All workspace endpoints require a Supabase access token:

```txt
Authorization: Bearer <supabase_access_token>
```

## Endpoints

- `GET /health`
- `GET /v1/me`
- `GET /v1/workspaces`
- `POST /v1/workspaces`
- `GET /v1/workspaces/:workspaceId`

## Responsibility Split

- `forgetkit-web` signs users in with Supabase Auth and sends the access token to this API.
- `forgetkit-api` verifies the token, validates payloads, performs authorization, and writes to Postgres through Prisma.
- Service-role Supabase credentials must only be configured in backend environments.
