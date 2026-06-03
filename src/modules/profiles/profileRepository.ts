import { prisma } from "../../database/prismaClient";

type UpsertProfileInput = {
  id: string;
  email: string | null;
  username?: string | null;
  displayName?: string | null;
};

export class ProfileRepository {
  constructor(private readonly db: any = prisma) {}

  async upsertByAuthUser(input: UpsertProfileInput) {
    return this.db.profile.upsert({
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
    return this.db.profile.findFirst({
      where: { username: username.toLowerCase() },
    });
  }
}
