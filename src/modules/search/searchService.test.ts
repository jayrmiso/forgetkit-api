import assert from "node:assert/strict";
import test from "node:test";
import { SearchService, type SearchRepositoryLike } from "./searchService";

function createRepository(): SearchRepositoryLike & { calls: string[] } {
  return {
    calls: [],
    async searchUsers(query) {
      this.calls.push(`users:${query}`);
      return [
        {
          id: "00000000-0000-4000-8000-000000000001",
          username: "kai",
          displayName: "Kai",
        },
      ];
    },
    async searchPublicWorkspaces(query) {
      this.calls.push(`workspaces:${query}`);
      return [
        {
          id: "1234567890abcdef1234567890abcdef",
          name: "Pixel Atlas",
          visibility: "public",
          members: [{ role: "owner", userProfile: { username: "kai" } }],
        },
      ];
    },
  };
}

test("SearchService returns user and public workspace results", async () => {
  const repository = createRepository();
  const service = new SearchService(repository);

  const results = await service.search({ query: "pixel", types: ["user", "workspace"] });

  assert.deepEqual(repository.calls, ["users:pixel", "workspaces:pixel"]);
  assert.deepEqual(results, [
    {
      type: "user",
      id: "00000000-0000-4000-8000-000000000001",
      username: "kai",
      displayName: "Kai",
    },
    {
      type: "workspace",
      id: "1234567890abcdef1234567890abcdef",
      name: "Pixel Atlas",
      ownerUsername: "kai",
      visibility: "public",
    },
  ]);
});

test("SearchService respects type filters", async () => {
  const repository = createRepository();
  const service = new SearchService(repository);

  const results = await service.search({ query: "kai", types: ["user"] });

  assert.deepEqual(repository.calls, ["users:kai"]);
  assert.equal(results.length, 1);
  assert.equal(results[0].type, "user");
});

test("SearchService skips users without usernames", async () => {
  const repository: SearchRepositoryLike = {
    async searchUsers() {
      return [{ id: "00000000-0000-4000-8000-000000000001", username: null, displayName: "No Handle" }];
    },
    async searchPublicWorkspaces() {
      return [];
    },
  };
  const service = new SearchService(repository);

  const results = await service.search({ query: "no", types: ["user"] });

  assert.deepEqual(results, []);
});
