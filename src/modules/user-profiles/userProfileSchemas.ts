import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserProfileDto = z.infer<typeof userProfileSchema>;
