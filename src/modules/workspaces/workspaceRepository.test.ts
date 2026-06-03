import assert from "node:assert/strict";
import test from "node:test";
import { WorkspaceRepository } from "./workspaceRepository";

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

  await repository.findManyForProfile("33333333-3333-4333-8333-333333333333");

  assert.deepEqual(capturedArgs, {
    where: { members: { some: { profileId: "33333333-3333-4333-8333-333333333333" } } },
    include: { members: { where: { profileId: "33333333-3333-4333-8333-333333333333" } } },
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

  await repository.findByIdForProfile(
    "11111111-1111-4111-8111-111111111111",
    "33333333-3333-4333-8333-333333333333",
  );

  assert.deepEqual(capturedArgs, {
    where: {
      id: "11111111-1111-4111-8111-111111111111",
      members: { some: { profileId: "33333333-3333-4333-8333-333333333333" } },
    },
    include: { members: { where: { profileId: "33333333-3333-4333-8333-333333333333" } } },
  });
});
