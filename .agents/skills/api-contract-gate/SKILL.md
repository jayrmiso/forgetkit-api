---
name: "api-contract-gate"
description: "Define and review API contracts before frontend/backend integration work"
---
<!-- DO NOT EDIT; managed by rac -->
# API Contract Gate

Use this before code depends on API behavior.

Required:
- Endpoint path and method
- Request params/body
- Response shape
- Error shape and status codes
- Zod schema ownership
- CORS/auth assumptions

Do not implement assumptions that are not documented or approved.
