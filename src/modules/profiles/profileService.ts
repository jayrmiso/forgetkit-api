import type { AuthContext } from "../auth/authTypes";
import { ProfileRepository } from "./profileRepository";
import type { ProfileDto } from "./profileSchemas";

function toDto(profile: { id: string; email: string | null; displayName: string | null; createdAt: Date; updatedAt: Date }): ProfileDto {
  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export class ProfileService {
  constructor(private readonly repository = new ProfileRepository()) {}

  async getOrCreateCurrentProfile(auth: AuthContext): Promise<ProfileDto> {
    const profile = await this.repository.upsertByAuthUser({
      id: auth.userId,
      email: auth.email,
    });

    return toDto(profile);
  }
}
