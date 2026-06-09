import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../../shared/errors/AppError";
import { WorkspaceService } from "./workspaceService";
import type { WorkspaceWithMember } from "./workspaceRepository";

const now = new Date("2026-06-02T00:00:00.000Z");

function workspace(overrides: Partial<WorkspaceWithMember> = {}): WorkspaceWithMember {
  return {
    id: "11111111111141118111111111111111",
    name: "Project Eclipse",
    status: "draft",
    engineTarget: "godot",
    visibility: "private",
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
    createdAt: now,
    updatedAt: now,
    members: [
      {
        id: "22222222-2222-4222-8222-222222222222",
        workspaceId: "11111111111141118111111111111111",
        userProfileId: "33333333-3333-4333-8333-333333333333",
        role: "owner",
        createdAt: now,
      },
    ],
    ...overrides,
  };
}

test("WorkspaceService creates workspace DTO with owner role", async () => {
  const service = new WorkspaceService({
    createForOwner: async () => workspace(),
    findManyForUserProfile: async () => [],
    findByIdForUserProfile: async () => null,
    updateByIdForOwner: async () => null,
  });

  const result = await service.createWorkspace("33333333-3333-4333-8333-333333333333", {
    name: "Project Eclipse",
    engineTarget: "godot",
    visibility: "private",
  });

  assert.equal(result.name, "Project Eclipse");
  assert.equal(result.role, "owner");
  assert.equal(result.engineTarget, "godot");
  assert.equal(result.visibility, "private");
  assert.equal(result.gameTitle, null);
});

test("WorkspaceService returns 404 for inaccessible workspace", async () => {
  const service = new WorkspaceService({
    createForOwner: async () => workspace(),
    findManyForUserProfile: async () => [],
    findByIdForUserProfile: async () => null,
    updateByIdForOwner: async () => null,
  });

  await assert.rejects(
    () => service.getWorkspace("33333333-3333-4333-8333-333333333333", "11111111111141118111111111111111"),
    (error) => error instanceof AppError && error.code === "WORKSPACE_NOT_FOUND" && error.statusCode === 404,
  );
});

test("WorkspaceService updates owner workspace settings", async () => {
  const service = new WorkspaceService({
    createForOwner: async () => workspace(),
    findManyForUserProfile: async () => [],
    findByIdForUserProfile: async () => null,
    updateByIdForOwner: async (_workspaceId, _userProfileId, input) => workspace({
      name: input.name ?? "Project Eclipse",
      engineTarget: input.engineTarget ?? "godot",
      visibility: input.visibility ?? "private",
      gameTitle: input.gameTitle ?? "Project Eclipse",
      currentFocus: input.currentFocus ?? null,
    }),
  });

  const result = await service.updateWorkspace(
    "33333333-3333-4333-8333-333333333333",
    "11111111111141118111111111111111",
    { name: "Public Project", visibility: "public", gameTitle: "Eclipse", currentFocus: "Prototype combat loop" },
  );

  assert.equal(result.name, "Public Project");
  assert.equal(result.visibility, "public");
  assert.equal(result.gameTitle, "Eclipse");
  assert.equal(result.currentFocus, "Prototype combat loop");
});

test("WorkspaceService returns 404 for non-owner workspace update", async () => {
  const service = new WorkspaceService({
    createForOwner: async () => workspace(),
    findManyForUserProfile: async () => [],
    findByIdForUserProfile: async () => null,
    updateByIdForOwner: async () => null,
  });

  await assert.rejects(
    () => service.updateWorkspace(
      "33333333-3333-4333-8333-333333333333",
      "11111111111141118111111111111111",
      { visibility: "public" },
    ),
    (error) => error instanceof AppError && error.code === "WORKSPACE_NOT_FOUND" && error.statusCode === 404,
  );
});
