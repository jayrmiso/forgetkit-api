import assert from "node:assert/strict";
import test from "node:test";
import { WorkspaceRepository } from "./workspaceRepository";

const hyphenlessWorkspaceId = /^[0-9a-f]{32}$/;
const now = new Date("2026-06-02T00:00:00.000Z");

test("WorkspaceRepository scopes list queries by profile membership", async () => {
  let capturedArgs: unknown;
  const repository = new WorkspaceRepository({
    workspace: {
      findMany: async (args: unknown) => {
        capturedArgs = args;
        return [];
      },
    },
  });

  await repository.findManyForUserProfile("33333333-3333-4333-8333-333333333333");

  assert.deepEqual(capturedArgs, {
    where: { members: { some: { userProfileId: "33333333-3333-4333-8333-333333333333" } } },
    include: { members: { where: { userProfileId: "33333333-3333-4333-8333-333333333333" } } },
    orderBy: { updatedAt: "desc" },
  });
});

test("WorkspaceRepository scopes detail queries by workspace id and profile membership", async () => {
  let capturedArgs: unknown;
  const repository = new WorkspaceRepository({
    workspace: {
      findFirst: async (args: unknown) => {
        capturedArgs = args;
        return null;
      },
    },
  });

  await repository.findByIdForUserProfile(
    "11111111-1111-4111-8111-111111111111",
    "33333333-3333-4333-8333-333333333333",
  );

  assert.deepEqual(capturedArgs, {
    where: {
      id: "11111111-1111-4111-8111-111111111111",
      members: { some: { userProfileId: "33333333-3333-4333-8333-333333333333" } },
    },
    include: { members: { where: { userProfileId: "33333333-3333-4333-8333-333333333333" } } },
  });
});

test("WorkspaceRepository creates hyphenless workspace ids", async () => {
  let createdData: unknown;
  const repository = new WorkspaceRepository({
    $transaction: async (callback: (tx: any) => Promise<unknown>) =>
      callback({
        userProfile: {
          upsert: async () => undefined,
        },
        workspace: {
          create: async (args: unknown) => {
            createdData = args;
            return {
              id: "11111111111141118111111111111111",
              name: "Project Eclipse",
              status: "draft",
              engineTarget: "godot",
              activeMilestone: null,
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
            };
          },
        },
      }),
  });

  await repository.createForOwner("33333333-3333-4333-8333-333333333333", {
    name: "Project Eclipse",
    engineTarget: "godot",
  });

  const createArgs = createdData as { data?: { id?: string } } | undefined;
  assert.ok(createArgs?.data?.id);
  assert.match(createArgs.data.id ?? "", hyphenlessWorkspaceId);
});
