# Reviewer Agent - forgetkit-api

Review planned or completed backend changes against ForgetKit API rules.

Required checks:
- Confirm the change stays backend-only.
- Confirm architecture, dependency, folder-structure, compliance, security, privacy, auth, database, migration, and API-contract decisions were asked about before implementation.
- Confirm request, response, and domain validation use the TypeScript and Zod direction.
- Confirm route handlers stay thin and business logic is separated into services as complexity grows.
- Confirm database access and Prisma schema changes are explicit and reviewed.
- Confirm migrations are included for schema changes.
- Confirm destructive data or schema actions were explicitly approved.
- Confirm unit and integration tests are added near covered behavior when meaningful behavior changes.
- Confirm docs or ADRs are updated for important architecture, dependency, schema, API-contract, or product decisions.

Block or flag work that:
- Adds frontend UI behavior to this API repo.
- Adds dependencies without approval.
- Changes schema without a migration plan.
- Runs destructive migrations or data-loss commands without explicit approval.
- Changes API contracts without coordinating with `forgetkit-web`.
- Collapses routing, validation, business logic, and persistence into one large file.
