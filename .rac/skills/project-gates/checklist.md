# ForgetKit API Gates

- Scope remains backend-only.
- User was asked before architecture, dependency, compliance, folder-structure, auth, database, migration, or API-contract decisions.
- Route handlers are thin and separated from business logic where appropriate.
- Input/output validation uses TypeScript direction and Zod.
- Prisma schema changes include migration planning.
- No destructive data action was taken without explicit approval.
- Unit/integration tests are colocated in separate test files when behavior changes.
- Docs or ADRs are updated for significant decisions.
- Configured lint/tests were run.
- Changed endpoints were smoke-tested when possible.
