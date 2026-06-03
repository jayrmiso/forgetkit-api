const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "ForgetKit API",
    version: "0.1.0",
    description: "Backend API for ForgetKit workspace preparation workflows.",
  },
  servers: [{ url: "http://localhost:3001" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "Supabase JWT" },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  required: ["path", "message", "code"],
                  properties: {
                    path: { type: "array", items: { type: ["string", "number"] } },
                    message: { type: "string" },
                    code: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      ServiceStatusResponse: {
        type: "object",
        required: ["service", "status"],
        properties: {
          service: { type: "string", enum: ["forgetkit-api"] },
          status: { type: "string", enum: ["ok"] },
        },
      },
      HealthResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["service", "status", "database"],
            properties: {
              service: { type: "string", enum: ["forgetkit-api"] },
              status: { type: "string", enum: ["ok"] },
              database: { type: "string", enum: ["ok"] },
            },
          },
        },
      },
      Profile: {
        type: "object",
        required: ["id", "email", "displayName", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: ["string", "null"], format: "email" },
          displayName: { type: ["string", "null"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProfileResponse: {
        type: "object",
        required: ["data"],
        properties: { data: { type: "object", required: ["profile"], properties: { profile: ref("Profile") } } },
      },
      Workspace: {
        type: "object",
        required: ["id", "name", "status", "engineTarget", "activeMilestone", "role", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          status: { type: "string", enum: ["draft", "active", "archived"] },
          engineTarget: { type: "string", enum: ["unknown", "godot"] },
          activeMilestone: { type: ["string", "null"] },
          role: { type: "string", enum: ["owner", "member"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      WorkspaceResponse: {
        type: "object",
        required: ["data"],
        properties: { data: { type: "object", required: ["workspace"], properties: { workspace: ref("Workspace") } } },
      },
      WorkspaceListResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["workspaces"],
            properties: { workspaces: { type: "array", items: ref("Workspace") } },
          },
        },
      },
      CreateWorkspaceRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          engineTarget: { type: "string", enum: ["unknown", "godot"], default: "unknown" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "Service status",
        responses: { "200": { description: "Service is running", ...json(ref("ServiceStatusResponse")) } },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": { description: "Service and database are available", ...json(ref("HealthResponse")) },
          "503": { description: "Database unavailable", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/me": {
      get: {
        summary: "Current profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current profile", ...json(ref("ProfileResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/workspaces": {
      get: {
        summary: "List workspaces",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Workspace list", ...json(ref("WorkspaceListResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
        },
      },
      post: {
        summary: "Create workspace",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: ref("CreateWorkspaceRequest") } } },
        responses: {
          "201": { description: "Workspace created", ...json(ref("WorkspaceResponse")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/workspaces/{workspaceId}": {
      get: {
        summary: "Get workspace",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "workspaceId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Workspace detail", ...json(ref("WorkspaceResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
          "404": { description: "Workspace not found", ...json(ref("ErrorResponse")) },
        },
      },
    },
  },
} as const;
