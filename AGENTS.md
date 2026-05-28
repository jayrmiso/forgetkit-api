# Agent Operating Rules - forgetkit-api

## Mission
ForgetKit is a game development preparation workspace. It supports concept building, story building, asset creation, asset libraries, documentation, planning, and pre-production workflows.

This repository is the backend API and data layer only.

## Decision Policy
- Ask before making product, architecture, compliance, security, privacy, licensing, dependency, folder-structure, database, migration, authentication, authorization, or API-contract decisions.
- If research is needed for compliance, licensing, security, privacy, or framework behavior, perform the research first and cite the relevant source in the final response.
- Make small local implementation choices only when they are clearly implied by existing files and do not change direction.

## Stack
- Express
- TypeScript target architecture, even if the initial scaffold still has JavaScript files
- Prisma
- PostgreSQL
- Zod for strict request, response, and domain validation

## Architecture Rules
- Keep this repo backend-only. Do not add frontend UI code here.
- Ask before changing top-level folder structure.
- Use proper separation of concerns: routes, controllers, services, repositories/data access, validation schemas, middleware, and shared utilities.
- Do not put all logic for a feature in a single route file.
- Keep route handlers thin. Business logic belongs in services as complexity grows.
- Keep database access behind repository/data-access modules once features become non-trivial.

## Naming Rules
- Classes and exported types use `UpperCamelCase`.
- Functions, variables, route handlers, services, and repositories use `camelCase`.
- Files should use `camelCase` or `UpperCamelCase` consistently based on what they export.
- Ask before introducing a different naming convention.

## API Rules
- Validate all input at API boundaries with Zod.
- Use consistent success and error response shapes.
- Document new endpoints, request payloads, response payloads, and status codes.
- Keep API changes backwards-compatible where practical.
- Coordinate API contracts with `forgetkit-web` before implementation.

## Database Rules
- Prisma schema is the source of truth for the data model.
- Schema changes require migrations.
- Never run destructive migrations or data-loss operations without explicit approval.
- Add an ADR for significant schema, migration, storage, tenancy, or data-retention decisions.

## Dependency Rules
- Ask before adding any new dependency.
- Explain why the dependency is needed, what it replaces, and any maintenance/security risk.
- Prefer platform, Express, Prisma, PostgreSQL, and Zod capabilities before adding packages.

## Testing Rules
- Add unit and integration tests for meaningful behavior.
- Keep tests near the code they cover, using separate test files.
- Integration tests should cover API behavior and persistence boundaries where relevant.
- Ask before choosing or changing the test framework.

## Git Workflow
- Use feature branches and PR-style discipline.
- `main` should be treated as protected and deployable.
- Do not push directly to `main` unless explicitly instructed.
- Do not run destructive git commands unless explicitly requested.

## Documentation
- Update documentation when API behavior, architecture, database schema, environment variables, or setup steps change.
- Add an ADR in `docs/adr/` for significant architecture, compliance, dependency, schema, or product-direction decisions.
- Keep `.rac/` as the source of truth and generate vendor-specific agent outputs from it.
- Use the Zuggie RAC pack for structured AI workflow: spec first, accepted spec second, implementation third, review before completion.
- Use local ForgetKit RAC agents and skills for project-specific architecture, decision, API contract, schema migration, and test gates.

## Validation Before Completion
- Run the configured lint command when available.
- Run unit and integration tests when available.
- Smoke-test changed endpoints locally when possible.
- Report any command that could not be run or failed for environment reasons.
