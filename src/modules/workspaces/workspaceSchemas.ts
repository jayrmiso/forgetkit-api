import { z } from "zod";
import { normalizeWorkspaceId, workspaceIdPattern } from "./workspaceId";

export const workspaceStatusSchema = z.enum(["draft", "active", "archived"]);
export const engineTargetSchema = z.enum(["unknown", "godot"]);
export const workspaceRoleSchema = z.enum(["owner", "member"]);
export const workspaceVisibilitySchema = z.enum(["private", "unlisted", "public"]);
export const cameraViewSchema = z.enum(["unknown", "top_down", "side_scroller", "isometric", "first_person", "third_person"]);

const nullableTextSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  },
  z.string().max(240).nullable(),
);

const nullableLongTextSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  },
  z.string().max(1000).nullable(),
);

export const createWorkspaceBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  engineTarget: engineTargetSchema.default("unknown"),
  visibility: workspaceVisibilitySchema.default("private"),
});

export const updateWorkspaceBodySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  engineTarget: engineTargetSchema.optional(),
  visibility: workspaceVisibilitySchema.optional(),
  gameTitle: nullableTextSchema.optional(),
  genre: nullableTextSchema.optional(),
  cameraView: cameraViewSchema.nullable().optional(),
  artDirection: nullableLongTextSchema.optional(),
  targetResolution: nullableTextSchema.optional(),
  defaultBiome: nullableTextSchema.optional(),
  defaultStyle: nullableTextSchema.optional(),
  currentFocus: nullableLongTextSchema.optional(),
  nextMilestone: nullableLongTextSchema.optional(),
  blockers: nullableLongTextSchema.optional(),
  storageRootPath: nullableTextSchema.optional(),
  godotProjectPath: nullableTextSchema.optional(),
  namingConvention: nullableLongTextSchema.optional(),
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
  gameTitle: z.string().nullable(),
  genre: z.string().nullable(),
  cameraView: cameraViewSchema.nullable(),
  artDirection: z.string().nullable(),
  targetResolution: z.string().nullable(),
  defaultBiome: z.string().nullable(),
  defaultStyle: z.string().nullable(),
  currentFocus: z.string().nullable(),
  nextMilestone: z.string().nullable(),
  blockers: z.string().nullable(),
  storageRootPath: z.string().nullable(),
  godotProjectPath: z.string().nullable(),
  namingConvention: z.string().nullable(),
  role: workspaceRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceBodySchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceBodySchema>;
export type WorkspaceDto = z.infer<typeof workspaceSchema>;
