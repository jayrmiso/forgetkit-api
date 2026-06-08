const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const workspaceIdSchema = { type: "string", pattern: "^[0-9a-f]{32}$", minLength: 32, maxLength: 32 } as const;

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
      UserProfile: {
        type: "object",
        required: ["id", "email", "username", "displayName", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: ["string", "null"], format: "email" },
          username: { type: ["string", "null"] },
          displayName: { type: ["string", "null"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserProfileResponse: {
        type: "object",
        required: ["data"],
        properties: { data: { type: "object", required: ["profile"], properties: { profile: ref("UserProfile") } } },
      },
      Workspace: {
        type: "object",
        required: ["id", "name", "status", "engineTarget", "visibility", "activeMilestone", "role", "createdAt", "updatedAt"],
        properties: {
          id: workspaceIdSchema,
          name: { type: "string" },
          status: { type: "string", enum: ["draft", "active", "archived"] },
          engineTarget: { type: "string", enum: ["unknown", "godot"] },
          visibility: { type: "string", enum: ["private", "unlisted", "public"] },
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
      AuthResolvedUser: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["user"],
            properties: {
              user: {
                type: "object",
                required: ["email", "username", "verified"],
                properties: {
                  email: { type: "string", format: "email" },
                  username: { type: ["string", "null"] },
                  verified: { type: "boolean" },
                },
              },
            },
          },
        },
      },
      VerificationStatusResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["verification"],
            properties: {
              verification: {
                type: "object",
                required: ["email", "verified", "verifiedAt"],
                properties: {
                  email: { type: "string", format: "email" },
                  verified: { type: "boolean" },
                  verifiedAt: { type: ["string", "null"], format: "date-time" },
                },
              },
            },
          },
        },
      },
      ResendVerificationResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["verification"],
            properties: {
              verification: {
                type: "object",
                required: ["email", "sent"],
                properties: {
                  email: { type: "string", format: "email" },
                  sent: { type: "boolean" },
                },
              },
            },
          },
        },
      },
      CreateWorkspaceRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          engineTarget: { type: "string", enum: ["unknown", "godot"], default: "unknown" },
          visibility: { type: "string", enum: ["private", "unlisted", "public"], default: "private" },
        },
      },
      UpdateWorkspaceRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          engineTarget: { type: "string", enum: ["unknown", "godot"] },
          visibility: { type: "string", enum: ["private", "unlisted", "public"] },
        },
      },
      SearchUserResult: {
        type: "object",
        required: ["type", "id", "username", "displayName"],
        properties: {
          type: { type: "string", enum: ["user"] },
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          displayName: { type: ["string", "null"] },
        },
      },
      SearchWorkspaceResult: {
        type: "object",
        required: ["type", "id", "name", "ownerUsername", "visibility"],
        properties: {
          type: { type: "string", enum: ["workspace"] },
          id: workspaceIdSchema,
          name: { type: "string" },
          ownerUsername: { type: ["string", "null"] },
          visibility: { type: "string", enum: ["public"] },
        },
      },
      SearchResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["results"],
            properties: {
              results: {
                type: "array",
                items: {
                  oneOf: [ref("SearchUserResult"), ref("SearchWorkspaceResult")],
                  discriminator: { propertyName: "type" },
                },
              },
            },
          },
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
          "200": { description: "Current profile", ...json(ref("UserProfileResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/search": {
      get: {
        summary: "Search users and public workspaces",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "query", in: "query", required: true, schema: { type: "string", minLength: 2, maxLength: 80 } },
          {
            name: "types",
            in: "query",
            required: false,
            schema: { type: "string", pattern: "^(user|workspace)(,(user|workspace))*$" },
            description: "Comma-separated result type filter. Defaults to user,workspace.",
          },
        ],
        responses: {
          "200": { description: "Search results", ...json(ref("SearchResponse")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/auth/resolve-identifier": {
      post: {
        summary: "Resolve username or email to an email address",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["identifier"], properties: { identifier: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Resolved account", ...json(ref("AuthResolvedUser")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
          "404": { description: "Account not found", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/auth/verification-status": {
      get: {
        summary: "Check whether an email has been verified",
        parameters: [{ name: "email", in: "query", required: true, schema: { type: "string", format: "email" } }],
        responses: {
          "200": { description: "Verification status", ...json(ref("VerificationStatusResponse")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
          "404": { description: "Account not found", ...json(ref("ErrorResponse")) },
        },
      },
    },
    "/v1/auth/resend-verification": {
      post: {
        summary: "Resend the signup verification email",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } } } },
        },
        responses: {
          "201": { description: "Verification email resent", ...json(ref("ResendVerificationResponse")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
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
        parameters: [{ name: "workspaceId", in: "path", required: true, schema: workspaceIdSchema }],
        responses: {
          "200": { description: "Workspace detail", ...json(ref("WorkspaceResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
          "404": { description: "Workspace not found", ...json(ref("ErrorResponse")) },
        },
      },
      patch: {
        summary: "Update workspace settings",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "workspaceId", in: "path", required: true, schema: workspaceIdSchema }],
        requestBody: { required: true, content: { "application/json": { schema: ref("UpdateWorkspaceRequest") } } },
        responses: {
          "200": { description: "Workspace updated", ...json(ref("WorkspaceResponse")) },
          "400": { description: "Validation error", ...json(ref("ErrorResponse")) },
          "401": { description: "Unauthorized", ...json(ref("ErrorResponse")) },
          "404": { description: "Workspace not found", ...json(ref("ErrorResponse")) },
        },
      },
    },
  },
} as const;
