# ADR 0002: Hyphenless Workspace Ids

## Status

Accepted

## Context

Workspace ids are part of the canonical route model in `forgetkit-web`, and the prior UUID-with-hyphens format made workspace URLs noisier than necessary. The frontend now treats workspace ids as opaque strings, so the backend can migrate the canonical id shape without changing the product contract again.

## Decision

Use hyphenless 32-character lowercase hex strings as the canonical workspace id format in `forgetkit-api`. Generate ids in application code with the Node standard library, store them as `VARCHAR(32)`, and migrate existing workspace ids plus every referencing foreign key by stripping hyphens from the current UUID values.

Do not keep a compatibility layer for the old UUID-shaped ids.

## Consequences

- Workspace URLs become shorter and easier to read.
- The backend no longer depends on database-generated UUID defaults for workspaces.
- Existing rows must be migrated carefully because workspace ids are referenced by membership and content tables.
- The API and docs now describe workspace ids as opaque hyphenless strings instead of UUIDs.
