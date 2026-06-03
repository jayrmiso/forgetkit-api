import type { WorkspaceMember } from "../../generated/prisma/client";
import type { CreateWorkspaceInput } from "./workspaceSchemas";

export type WorkspaceWithMember = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  engineTarget: "unknown" | "godot";
  activeMilestone: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
};

export class WorkspaceRepository {
  constructor(private readonly db: any) {}

  async createForOwner(profileId: string, input: CreateWorkspaceInput): Promise<WorkspaceWithMember> {
    return this.db.$transaction(async (tx: any) => {
      await tx.profile.upsert({
        where: { id: profileId },
        create: { id: profileId, email: null, displayName: null },
        update: {},
      });

      const workspace = await tx.workspace.create({
        data: {
          name: input.name,
          engineTarget: input.engineTarget,
          members: {
            create: {
              profileId,
              role: "owner",
            },
          },
        },
        include: { members: { where: { profileId } } },
      });

      return workspace as WorkspaceWithMember;
    });
  }

  async findManyForProfile(profileId: string): Promise<WorkspaceWithMember[]> {
    return this.db.workspace.findMany({
      where: { members: { some: { profileId } } },
      include: { members: { where: { profileId } } },
      orderBy: { updatedAt: "desc" },
    }) as Promise<WorkspaceWithMember[]>;
  }

  async findByIdForProfile(workspaceId: string, profileId: string): Promise<WorkspaceWithMember | null> {
    return this.db.workspace.findFirst({
      where: { id: workspaceId, members: { some: { profileId } } },
      include: { members: { where: { profileId } } },
    }) as Promise<WorkspaceWithMember | null>;
  }
}
