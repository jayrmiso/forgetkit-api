import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceBodySchema } from "./workspaceSchemas";

test("createWorkspaceBodySchema trims names and defaults engine target", () => {
  const result = createWorkspaceBodySchema.parse({ name: "  Project Eclipse  " });

  assert.equal(result.name, "Project Eclipse");
  assert.equal(result.engineTarget, "unknown");
});

test("createWorkspaceBodySchema rejects empty names", () => {
  assert.throws(() => createWorkspaceBodySchema.parse({ name: "   " }));
});
