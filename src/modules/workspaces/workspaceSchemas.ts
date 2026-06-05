import { z } from "zod";
import { workspaceIdPattern } from "./workspaceId";

export const workspaceStatusSchema = z.enum(["draft", "active", "archived"]);
export const engineTargetSchema = z.enum(["unknown", "godot"]);
export const workspaceRoleSchema = z.enum(["owner", "member"]);

export const createWorkspaceBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  engineTarget: engineTargetSchema.default("unknown"),
});

export const workspaceParamsSchema = z.object({
  workspaceId: z.string().regex(workspaceIdPattern),
});

export const workspaceSchema = z.object({
  id: z.string().regex(workspaceIdPattern),
  name: z.string(),
  status: workspaceStatusSchema,
  engineTarget: engineTargetSchema,
  activeMilestone: z.string().nullable(),
  role: workspaceRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceBodySchema>;
export type WorkspaceDto = z.infer<typeof workspaceSchema>;
