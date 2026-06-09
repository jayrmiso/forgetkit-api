import assert from "node:assert/strict";
import test from "node:test";
import { createWorkspaceBodySchema, updateWorkspaceBodySchema } from "./workspaceSchemas";
import { workspaceParamsSchema, workspaceSchema } from "./workspaceSchemas";

test("createWorkspaceBodySchema trims names and defaults engine target", () => {
  const result = createWorkspaceBodySchema.parse({ name: "  Project Eclipse  " });

  assert.equal(result.name, "Project Eclipse");
  assert.equal(result.engineTarget, "unknown");
  assert.equal(result.visibility, "private");
});

test("createWorkspaceBodySchema rejects empty names", () => {
  assert.throws(() => createWorkspaceBodySchema.parse({ name: "   " }));
});

test("updateWorkspaceBodySchema accepts editable settings and rejects empty updates", () => {
  assert.deepEqual(updateWorkspaceBodySchema.parse({
    name: "  Project Eclipse  ",
    engineTarget: "godot",
    visibility: "public",
    gameTitle: "  Eclipse  ",
    cameraView: "top_down",
    artDirection: "  painterly pixel art  ",
    blockers: "",
  }), {
    name: "Project Eclipse",
    engineTarget: "godot",
    visibility: "public",
    gameTitle: "Eclipse",
    cameraView: "top_down",
    artDirection: "painterly pixel art",
    blockers: null,
  });

  assert.throws(() => updateWorkspaceBodySchema.parse({}));
});

test("workspace schemas accept hyphenless ids and normalize uuid route ids", () => {
  const workspaceId = "11111111111141118111111111111111";

  assert.equal(workspaceParamsSchema.parse({ workspaceId }).workspaceId, workspaceId);
  assert.equal(
    workspaceParamsSchema.parse({ workspaceId: "11111111-1111-4111-8111-111111111111" }).workspaceId,
    workspaceId,
  );
  assert.equal(workspaceSchema.parse({
    id: workspaceId,
    name: "Project Eclipse",
    status: "draft",
    engineTarget: "godot",
    visibility: "public",
    activeMilestone: null,
    gameTitle: null,
    genre: null,
    cameraView: null,
    artDirection: null,
    targetResolution: null,
    defaultBiome: null,
    defaultStyle: null,
    currentFocus: null,
    nextMilestone: null,
    blockers: null,
    storageRootPath: null,
    godotProjectPath: null,
    namingConvention: null,
    role: "owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).id, workspaceId);
  assert.throws(() => workspaceParamsSchema.parse({ workspaceId: "not-a-workspace-id" }));
});
