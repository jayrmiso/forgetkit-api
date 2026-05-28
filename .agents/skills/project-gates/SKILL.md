---
name: "project-gates"
description: "Run ForgetKit API quality gates before review"
---
<!-- DO NOT EDIT; managed by rac -->
# Project Gates - forgetkit-api

Run the required quality gates and summarize pass/fail with evidence.

Required when configured:
- lint
- unit tests
- integration tests

For API behavior changes:
- Smoke-test changed endpoints locally when possible.

For schema changes:
- Validate Prisma schema.
- Confirm migration files exist.

Report any skipped command with the exact reason.
