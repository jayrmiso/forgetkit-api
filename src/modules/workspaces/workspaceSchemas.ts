import { z } from "zod";
import { normalizeWorkspaceId, workspaceIdPattern } from "./workspaceId";

export const workspaceStatusSchema = z.enum(["draft", "active", "archived"]);
export const engineTargetSchema = z.enum(["unknown", "godot"]);
export const workspaceRoleSchema = z.enum(["owner", "member"]);
export const workspaceVisibilitySchema = z.enum(["private", "unlisted", "public"]);

export const createWorkspaceBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  engineTarget: engineTargetSchema.default("unknown"),
  visibility: workspaceVisibilitySchema.default("private"),
});

export const updateWorkspaceBodySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  engineTarget: engineTargetSchema.optional(),
  visibility: workspaceVisibilitySchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one workspace setting is required",
});

export const workspaceParamsSchema = z.object({
  workspaceId: z.string().regex(workspaceIdPattern).transform(normalizeWorkspaceId),
});

export const workspaceSchema = z.object({
  id: z.string().regex(workspaceIdPattern),
  name: z.string(),
  status: workspaceStatusSchema,
  engineTarget: engineTargetSchema,
  visibility: workspaceVisibilitySchema,
  activeMilestone: z.string().nullable(),
  role: workspaceRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceBodySchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceBodySchema>;
export type WorkspaceDto = z.infer<typeof workspaceSchema>;
