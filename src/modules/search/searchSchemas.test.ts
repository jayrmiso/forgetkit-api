import assert from "node:assert/strict";
import test from "node:test";
import { searchQuerySchema } from "./searchSchemas";

test("searchQuerySchema trims query and defaults result types", () => {
  const parsed = searchQuerySchema.parse({ query: "  pixel  " });

  assert.deepEqual(parsed, {
    query: "pixel",
    types: ["user", "workspace"],
  });
});

test("searchQuerySchema parses comma-separated result types", () => {
  const parsed = searchQuerySchema.parse({ query: "kai", types: "user,workspace" });

  assert.deepEqual(parsed.types, ["user", "workspace"]);
});

test("searchQuerySchema rejects short queries and unknown types", () => {
  assert.throws(() => searchQuerySchema.parse({ query: "a" }));
  assert.throws(() => searchQuerySchema.parse({ query: "pixel", types: "user,asset" }));
});
