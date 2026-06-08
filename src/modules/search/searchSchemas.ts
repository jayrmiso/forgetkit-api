import { z } from "zod";

export const searchResultTypeSchema = z.enum(["user", "workspace"]);

const searchTypesQuerySchema = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return ["user", "workspace"] as const;
    }

    return value
      .split(",")
      .map((type) => type.trim())
      .filter(Boolean);
  })
  .pipe(z.array(searchResultTypeSchema).min(1));

export const searchQuerySchema = z.object({
  query: z.string().trim().min(2).max(80),
  types: searchTypesQuerySchema,
});

export const userSearchResultSchema = z.object({
  type: z.literal("user"),
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string().nullable(),
});

export const workspaceSearchResultSchema = z.object({
  type: z.literal("workspace"),
  id: z.string(),
  name: z.string(),
  ownerUsername: z.string(),
  visibility: z.literal("public"),
});

export const searchResultSchema = z.discriminatedUnion("type", [userSearchResultSchema, workspaceSearchResultSchema]);

export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResultType = z.infer<typeof searchResultTypeSchema>;
export type SearchResultDto = z.infer<typeof searchResultSchema>;
