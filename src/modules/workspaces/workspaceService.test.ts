import assert from "node:assert/strict";
import test from "node:test";
import { AppError } from "../../shared/errors/AppError";
import { WorkspaceService } from "./workspaceService";
import type { WorkspaceWithMember } from "./workspaceRepository";

const now = new Date("2026-06-02T00:00:00.000Z");

function workspace(overrides: Partial<WorkspaceWithMember> = {}): WorkspaceWithMember {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Project Eclipse",
    status: "draft",
    engineTarget: "godot",
    activeMilestone: null,
    createdAt: now,
    updatedAt: now,
    members: [
      {
        id: "22222222-2222-4222-8222-222222222222",
        workspaceId: "11111111-1111-4111-8111-111111111111",
        profileId: "33333333-3333-4333-8333-333333333333",
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
    findManyForProfile: async () => [],
    findByIdForProfile: async () => null,
  });

  const result = await service.createWorkspace("33333333-3333-4333-8333-333333333333", {
    name: "Project Eclipse",
    engineTarget: "godot",
  });

  assert.equal(result.name, "Project Eclipse");
  assert.equal(result.role, "owner");
  assert.equal(result.engineTarget, "godot");
});

test("WorkspaceService returns 404 for inaccessible workspace", async () => {
  const service = new WorkspaceService({
    createForOwner: async () => workspace(),
    findManyForProfile: async () => [],
    findByIdForProfile: async () => null,
  });

  await assert.rejects(
    () => service.getWorkspace("33333333-3333-4333-8333-333333333333", "11111111-1111-4111-8111-111111111111"),
    (error) => error instanceof AppError && error.code === "WORKSPACE_NOT_FOUND" && error.statusCode === 404,
  );
});
