import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import type { AuthContext } from "./authTypes";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SupabaseAuthUser = {
  email: string | null;
  email_confirmed_at: string | null;
  user_metadata?: Record<string, unknown> | null;
};

function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError("INTERNAL_SERVER_ERROR", "Supabase service role key is missing", 500);
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

function getUsername(user: SupabaseAuthUser) {
  const username = user.user_metadata?.username;

  if (typeof username !== "string") {
    return null;
  }

  const normalized = username.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

async function findAuthUser(predicate: (user: SupabaseAuthUser) => boolean) {
  const client = createAdminClient();
  const perPage = 100;

  for (let page = 1; page < 100; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Unable to query Supabase auth users", 500, error.message);
    }

    const user = data.users.find((candidate) => predicate(candidate as SupabaseAuthUser)) as SupabaseAuthUser | undefined;
    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }
  }

  return null;
}

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

export async function resolveAuthIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);

  if (!normalized) {
    throw new AppError("BAD_REQUEST", "Identifier is required", 400);
  }

  const user = await findAuthUser((candidate) =>
    normalized.includes("@")
      ? candidate.email?.toLowerCase() === normalized
      : getUsername(candidate) === normalized,
  );

  if (!user) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }

  return {
    email: user.email ?? normalized,
    username: getUsername(user),
    verified: Boolean(user.email_confirmed_at),
  };
}

export async function getVerificationStatus(email: string) {
  const normalized = normalizeIdentifier(email);

  if (!normalized) {
    throw new AppError("BAD_REQUEST", "Email is required", 400);
  }

  const user = await findAuthUser((candidate) => candidate.email?.toLowerCase() === normalized);

  if (!user) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }

  return {
    email: user.email ?? normalized,
    verified: Boolean(user.email_confirmed_at),
    verifiedAt: user.email_confirmed_at,
  };
}

export async function resendVerificationEmail(email: string) {
  const normalized = normalizeIdentifier(email);

  if (!normalized) {
    throw new AppError("BAD_REQUEST", "Email is required", 400);
  }

  const client = createAdminClient();
  const { error } = await client.auth.resend({ type: "signup", email: normalized });

  if (error) {
    throw new AppError("BAD_REQUEST", "Unable to resend verification email", 400, error.message);
  }

  return { email: normalized, sent: true };
}
