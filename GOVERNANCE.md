# Governance - forgetkit-api

## Purpose
This repository contains the ForgetKit backend API and data layer.

## Ownership
- Primary owner: product maintainer
- Contributors: approved collaborators via pull request

## Branching
- `main` is always deployable.
- Feature work uses `feat/*`, `fix/*`, `chore/*`.
- Avoid direct pushes to `main`.

## Pull Requests
- At least one review before merge (except solo emergency fixes).
- PR must include API impact, migration impact, and test notes.
- Keep PRs focused and reversible.

## Quality Gates
- Lint/tests should pass in CI.
- New endpoints need basic request/response validation.
- Schema changes must include migrations.

## Security
- Never commit secrets or `.env*`.
- Use least-privilege DB credentials.
- Validate and sanitize input on all endpoints.

## Data Governance
- Prisma schema is source of truth for data model.
- Every breaking schema change requires an ADR in `docs/adr/`.

## Versioning
- Semantic versioning for releases.
