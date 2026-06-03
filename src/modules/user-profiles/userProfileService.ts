import type { AuthContext } from "../auth/authTypes";
import { UserProfileRepository } from "./userProfileRepository";
import type { UserProfileDto } from "./userProfileSchemas";

function toDto(userProfile: { id: string; email: string | null; username: string | null; displayName: string | null; createdAt: Date; updatedAt: Date }): UserProfileDto {
  return {
    id: userProfile.id,
    email: userProfile.email,
    username: userProfile.username,
    displayName: userProfile.displayName,
    createdAt: userProfile.createdAt.toISOString(),
    updatedAt: userProfile.updatedAt.toISOString(),
  };
}

export class UserProfileService {
  constructor(private readonly repository = new UserProfileRepository()) {}

  async getOrCreateCurrentUserProfile(auth: AuthContext): Promise<UserProfileDto> {
    const username = typeof auth.claims.username === "string" ? auth.claims.username.trim().toLowerCase() : null;
    const displayName = typeof auth.claims.full_name === "string" ? auth.claims.full_name : null;

    const userProfile = await this.repository.upsertByAuthUser({
      id: auth.userId,
      email: auth.email,
      username,
      displayName,
    });

    return toDto(userProfile);
  }
}
