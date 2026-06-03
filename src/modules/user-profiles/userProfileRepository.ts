import { prisma } from "../../database/prismaClient";

type UpsertUserProfileInput = {
  id: string;
  email: string | null;
  username?: string | null;
  displayName?: string | null;
};

export class UserProfileRepository {
  constructor(private readonly db: any = prisma) {}

  async upsertByAuthUser(input: UpsertUserProfileInput) {
    return this.db.userProfile.upsert({
      where: { id: input.id },
      create: {
        id: input.id,
        email: input.email,
        username: input.username ?? null,
        displayName: input.displayName ?? null,
      },
      update: {
        email: input.email,
        ...(input.username === undefined ? {} : { username: input.username }),
        ...(input.displayName === undefined ? {} : { displayName: input.displayName }),
      },
    });
  }

  async findByUsername(username: string) {
    return this.db.userProfile.findFirst({
      where: { username: username.toLowerCase() },
    });
  }
}
