# ADR 0001: Auth And Workspace Data Foundation

## Status

Accepted

## Context

ForgetKit needs authenticated workspace persistence before AI onboarding, design documents, assets, generation jobs, and version history can become real product flows. The API repository owns backend contracts and database access; the web repository remains frontend-only.

## Decision

Use Supabase Auth as the identity provider. `forgetkit-api` verifies Supabase access tokens, stores local `user_profile` rows keyed by the Supabase user id, keeps a unique lowercase username on the profile row, and uses Prisma against Postgres for workspace and membership persistence.

Workspace membership is the initial tenancy boundary. Every workspace query must be scoped by authenticated profile membership.

Use Zod for request/response boundary validation and OpenAPI/Swagger docs for interactive API testing.

## Consequences

- The frontend never receives service-role credentials.
- The API owns privileged database writes and authorization checks.
- Workspace membership exists even while the product is solo-first, avoiding a later authorization rewrite.
- AI, storage, assets, and documents can build on the same workspace boundary later.
