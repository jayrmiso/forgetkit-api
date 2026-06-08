import assert from "node:assert/strict";
import test from "node:test";
import { SearchRepository } from "./searchRepository";

test("SearchRepository scopes user search to profiles with usernames", async () => {
  let capturedArgs: unknown;
  const repository = new SearchRepository({
    userProfile: {
      findMany(args: unknown) {
        capturedArgs = args;
        return [];
      },
    },
  });

  await repository.searchUsers("kai");

  assert.deepEqual(capturedArgs, {
    where: {
      username: { not: null },
      OR: [
        { username: { contains: "kai", mode: "insensitive" } },
        { displayName: { contains: "kai", mode: "insensitive" } },
        { email: { contains: "kai", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
    },
    orderBy: [{ username: "asc" }],
    take: 8,
  });
});

test("SearchRepository searches only public workspaces and includes owner username", async () => {
  let capturedArgs: unknown;
  const repository = new SearchRepository({
    workspace: {
      findMany(args: unknown) {
        capturedArgs = args;
        return [];
      },
    },
  });

  await repository.searchPublicWorkspaces("atlas");

  assert.deepEqual(capturedArgs, {
    where: {
      visibility: "public",
      name: { contains: "atlas", mode: "insensitive" },
    },
    include: {
      members: {
        where: { role: "owner" },
        include: {
          userProfile: {
            select: { username: true },
          },
        },
        take: 1,
      },
    },
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    take: 8,
  });
});
