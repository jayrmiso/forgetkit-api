import type { AuthContext } from "../auth/authTypes";
import { ProfileRepository } from "./profileRepository";
import type { ProfileDto } from "./profileSchemas";

function toDto(profile: { id: string; email: string | null; username: string | null; displayName: string | null; createdAt: Date; updatedAt: Date }): ProfileDto {
  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    displayName: profile.displayName,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export class ProfileService {
  constructor(private readonly repository = new ProfileRepository()) {}

  async getOrCreateCurrentProfile(auth: AuthContext): Promise<ProfileDto> {
    const username = typeof auth.claims.username === "string" ? auth.claims.username.trim().toLowerCase() : null;
    const displayName = typeof auth.claims.full_name === "string" ? auth.claims.full_name : null;

    const profile = await this.repository.upsertByAuthUser({
      id: auth.userId,
      email: auth.email,
      username,
      displayName,
    });

    return toDto(profile);
  }
}
