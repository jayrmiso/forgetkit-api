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

test("SearchService flexibly matches public workspaces and keeps owner usernames", async () => {
  const repository: SearchRepositoryLike = {
    async searchUsers() {
      return [];
    },
    async searchPublicWorkspaces() {
      return [
        {
          id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          name: "hello A world",
          visibility: "public",
          members: [{ role: "owner", userProfile: { username: "owner-one" } }],
        },
        {
          id: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          name: "unrelated world",
          visibility: "public",
          members: [{ role: "owner", userProfile: { username: "owner-two" } }],
        },
      ];
    },
  };
  const service = new SearchService(repository);

  const results = await service.search({ query: "helloworld A", types: ["workspace"] });

  assert.deepEqual(results, [
    {
      type: "workspace",
      id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      name: "hello A world",
      ownerUsername: "owner-one",
      visibility: "public",
    },
  ]);
});

test("SearchService excludes workspace results without owner usernames", async () => {
  const repository: SearchRepositoryLike = {
    async searchUsers() {
      return [];
    },
    async searchPublicWorkspaces() {
      return [
        {
          id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          name: "Pixel Atlas",
          visibility: "public",
          members: [{ role: "owner", userProfile: { username: null } }],
        },
      ];
    },
  };
  const service = new SearchService(repository);

  const results = await service.search({ query: "pixel", types: ["workspace"] });

  assert.deepEqual(results, []);
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
