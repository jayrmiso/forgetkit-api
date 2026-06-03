import { prisma } from "../../database/prismaClient";

type UpsertProfileInput = {
  id: string;
  email: string | null;
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
        displayName: input.displayName ?? null,
      },
      update: {
        email: input.email,
        ...(input.displayName === undefined ? {} : { displayName: input.displayName }),
      },
    });
  }
}
