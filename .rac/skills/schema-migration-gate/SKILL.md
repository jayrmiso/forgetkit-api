+++
name = "Schema Migration Gate"
description = "Require reviewed Prisma schema and migration planning before database changes"
+++
# Schema Migration Gate

Use this before Prisma schema or database changes.

Required:
- Data model change summary
- Migration impact
- Backward compatibility assessment
- Data-loss risk
- Rollback or recovery note
- Explicit approval for destructive operations
