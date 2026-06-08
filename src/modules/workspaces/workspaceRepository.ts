import type { WorkspaceMember } from "../../generated/prisma/client";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspaceSchemas";
import { generateWorkspaceId } from "./workspaceId";

export type WorkspaceWithMember = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  engineTarget: "unknown" | "godot";
  visibility: "private" | "unlisted" | "public";
  activeMilestone: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
};

export class WorkspaceRepository {
  constructor(private readonly db: any) {}

  async createForOwner(userProfileId: string, input: CreateWorkspaceInput): Promise<WorkspaceWithMember> {
    return this.db.$transaction(async (tx: any) => {
      await tx.userProfile.upsert({
        where: { id: userProfileId },
        create: { id: userProfileId, email: null, displayName: null },
        update: {},
      });

      const workspace = await tx.workspace.create({
        data: {
          id: generateWorkspaceId(),
          name: input.name,
          engineTarget: input.engineTarget,
          visibility: input.visibility,
          members: {
            create: {
              userProfileId,
              role: "owner",
            },
          },
        },
        include: { members: { where: { userProfileId } } },
      });

      return workspace as WorkspaceWithMember;
    });
  }

  async findManyForUserProfile(userProfileId: string): Promise<WorkspaceWithMember[]> {
    return this.db.workspace.findMany({
      where: { members: { some: { userProfileId } } },
      include: { members: { where: { userProfileId } } },
      orderBy: { updatedAt: "desc" },
    }) as Promise<WorkspaceWithMember[]>;
  }

  async findByIdForUserProfile(workspaceId: string, userProfileId: string): Promise<WorkspaceWithMember | null> {
    return this.db.workspace.findFirst({
      where: { id: workspaceId, members: { some: { userProfileId } } },
      include: { members: { where: { userProfileId } } },
    }) as Promise<WorkspaceWithMember | null>;
  }

  async updateByIdForOwner(workspaceId: string, userProfileId: string, input: UpdateWorkspaceInput): Promise<WorkspaceWithMember | null> {
    const workspace = await this.db.workspace.findFirst({
      where: { id: workspaceId, members: { some: { userProfileId, role: "owner" } } },
      select: { id: true },
    });

    if (!workspace) {
      return null;
    }

    return this.db.workspace.update({
      where: { id: workspaceId },
      data: input,
      include: { members: { where: { userProfileId } } },
    }) as Promise<WorkspaceWithMember>;
  }
}
