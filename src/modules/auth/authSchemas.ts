import { z } from "zod";

export const authIdentifierSchema = z.object({
  identifier: z.string().trim().min(1, "Identifier is required"),
});

export const authEmailSchema = z.object({
  email: z.string().trim().email(),
});

export const authResolvedUserSchema = z.object({
  email: z.string().email(),
  username: z.string().nullable(),
  verified: z.boolean(),
});

export const authVerificationStatusSchema = z.object({
  email: z.string().email(),
  verified: z.boolean(),
  verifiedAt: z.string().nullable(),
});

export const authResendVerificationSchema = z.object({
  email: z.string().trim().email(),
});

export type AuthIdentifierInput = z.infer<typeof authIdentifierSchema>;
export type AuthEmailInput = z.infer<typeof authEmailSchema>;
