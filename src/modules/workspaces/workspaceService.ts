import { AppError } from "../../shared/errors/AppError";
import type { CreateWorkspaceInput, WorkspaceDto } from "./workspaceSchemas";

export type WorkspaceWithMember = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  engineTarget: "unknown" | "godot";
  activeMilestone: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: Array<{ role: "owner" | "member" }>;
};

export type WorkspaceRepositoryLike = {
  createForOwner(profileId: string, input: CreateWorkspaceInput): Promise<WorkspaceWithMember>;
  findManyForProfile(profileId: string): Promise<WorkspaceWithMember[]>;
  findByIdForProfile(workspaceId: string, profileId: string): Promise<WorkspaceWithMember | null>;
};

function toDto(workspace: WorkspaceWithMember): WorkspaceDto {
  const member = workspace.members[0];

  return {
    id: workspace.id,
    name: workspace.name,
    status: workspace.status,
    engineTarget: workspace.engineTarget,
    activeMilestone: workspace.activeMilestone,
    role: member?.role ?? "member",
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}

export class WorkspaceService {
  constructor(private readonly repository: WorkspaceRepositoryLike) {}

  async createWorkspace(profileId: string, input: CreateWorkspaceInput): Promise<WorkspaceDto> {
    const workspace = await this.repository.createForOwner(profileId, input);
    return toDto(workspace);
  }

  async listWorkspaces(profileId: string): Promise<WorkspaceDto[]> {
    const workspaces = await this.repository.findManyForProfile(profileId);
    return workspaces.map(toDto);
  }

  async getWorkspace(profileId: string, workspaceId: string): Promise<WorkspaceDto> {
    const workspace = await this.repository.findByIdForProfile(workspaceId, profileId);

    if (!workspace) {
      throw new AppError("WORKSPACE_NOT_FOUND", "Workspace not found", 404);
    }

    return toDto(workspace);
  }
}
