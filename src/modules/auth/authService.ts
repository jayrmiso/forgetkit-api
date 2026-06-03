import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import type { AuthContext } from "./authTypes";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function verifyAccessToken(token: string): Promise<AuthContext> {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired access token", 401);
  }

  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    claims: data.user.user_metadata ?? {},
  };
}
