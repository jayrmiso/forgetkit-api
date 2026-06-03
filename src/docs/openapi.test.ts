import assert from "node:assert/strict";
import test from "node:test";
import { openApiDocument } from "./openapi";

test("OpenAPI document includes docs for protected workspace routes", () => {
  assert.equal(openApiDocument.openapi, "3.1.0");
  assert.ok(openApiDocument.components.securitySchemes.bearerAuth);
  assert.ok(openApiDocument.paths["/v1/workspaces"]);
  assert.ok(openApiDocument.paths["/v1/workspaces/{workspaceId}"]);
});

test("OpenAPI workspace responses include concrete JSON schemas", () => {
  const workspaceList = openApiDocument.paths["/v1/workspaces"].get.responses["200"];
  const workspaceCreate = openApiDocument.paths["/v1/workspaces"].post.responses["201"];
  const workspaceDetail = openApiDocument.paths["/v1/workspaces/{workspaceId}"].get.responses["200"];

  assert.deepEqual(workspaceList.content["application/json"].schema, { $ref: "#/components/schemas/WorkspaceListResponse" });
  assert.deepEqual(workspaceCreate.content["application/json"].schema, { $ref: "#/components/schemas/WorkspaceResponse" });
  assert.deepEqual(workspaceDetail.content["application/json"].schema, { $ref: "#/components/schemas/WorkspaceResponse" });
});

test("OpenAPI root status route documents its response payload", () => {
  const rootStatus = openApiDocument.paths["/"].get.responses["200"];

  assert.deepEqual(rootStatus.content["application/json"].schema, { $ref: "#/components/schemas/ServiceStatusResponse" });
});
