import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceBodySchema } from "./workspaceSchemas";
import { workspaceParamsSchema, workspaceSchema } from "./workspaceSchemas";

test("createWorkspaceBodySchema trims names and defaults engine target", () => {
  const result = createWorkspaceBodySchema.parse({ name: "  Project Eclipse  " });

  assert.equal(result.name, "Project Eclipse");
  assert.equal(result.engineTarget, "unknown");
});

test("createWorkspaceBodySchema rejects empty names", () => {
  assert.throws(() => createWorkspaceBodySchema.parse({ name: "   " }));
});

test("workspace schemas accept hyphenless workspace ids only", () => {
  const workspaceId = "11111111111141118111111111111111";

  assert.equal(workspaceParamsSchema.parse({ workspaceId }).workspaceId, workspaceId);
  assert.equal(workspaceSchema.parse({
    id: workspaceId,
    name: "Project Eclipse",
    status: "draft",
    engineTarget: "godot",
    activeMilestone: null,
    role: "owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).id, workspaceId);
  assert.throws(() => workspaceParamsSchema.parse({ workspaceId: "11111111-1111-4111-8111-111111111111" }));
});
