import { AppError } from "../../shared/errors/AppError";
import type { CreateWorkspaceInput, UpdateWorkspaceInput, WorkspaceDto } from "./workspaceSchemas";

export type WorkspaceWithMember = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  engineTarget: "unknown" | "godot";
  visibility: "private" | "unlisted" | "public";
  activeMilestone: string | null;
  gameTitle: string | null;
  genre: string | null;
  cameraView: "unknown" | "top_down" | "side_scroller" | "isometric" | "first_person" | "third_person" | null;
  artDirection: string | null;
  targetResolution: string | null;
  defaultBiome: string | null;
  defaultStyle: string | null;
  currentFocus: string | null;
  nextMilestone: string | null;
  blockers: string | null;
  storageRootPath: string | null;
  godotProjectPath: string | null;
  namingConvention: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: Array<{ role: "owner" | "member" }>;
};

export type WorkspaceRepositoryLike = {
  createForOwner(userProfileId: string, input: CreateWorkspaceInput): Promise<WorkspaceWithMember>;
  findManyForUserProfile(userProfileId: string): Promise<WorkspaceWithMember[]>;
  findByIdForUserProfile(workspaceId: string, userProfileId: string): Promise<WorkspaceWithMember | null>;
  updateByIdForOwner(workspaceId: string, userProfileId: string, input: UpdateWorkspaceInput): Promise<WorkspaceWithMember | null>;
};

function toDto(workspace: WorkspaceWithMember): WorkspaceDto {
  const member = workspace.members[0];

  return {
    id: workspace.id,
    name: workspace.name,
    status: workspace.status,
    engineTarget: workspace.engineTarget,
    visibility: workspace.visibility,
    activeMilestone: workspace.activeMilestone,
    gameTitle: workspace.gameTitle,
    genre: workspace.genre,
    cameraView: workspace.cameraView,
    artDirection: workspace.artDirection,
    targetResolution: workspace.targetResolution,
    defaultBiome: workspace.defaultBiome,
    defaultStyle: workspace.defaultStyle,
    currentFocus: workspace.currentFocus,
    nextMilestone: workspace.nextMilestone,
    blockers: workspace.blockers,
    storageRootPath: workspace.storageRootPath,
    godotProjectPath: workspace.godotProjectPath,
    namingConvention: workspace.namingConvention,
    role: member?.role ?? "member",
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}

export class WorkspaceService {
  constructor(private readonly repository: WorkspaceRepositoryLike) {}

  async createWorkspace(userProfileId: string, input: CreateWorkspaceInput): Promise<WorkspaceDto> {
    const workspace = await this.repository.createForOwner(userProfileId, input);
    return toDto(workspace);
  }

  async listWorkspaces(userProfileId: string): Promise<WorkspaceDto[]> {
    const workspaces = await this.repository.findManyForUserProfile(userProfileId);
    return workspaces.map(toDto);
  }

  async getWorkspace(userProfileId: string, workspaceId: string): Promise<WorkspaceDto> {
    const workspace = await this.repository.findByIdForUserProfile(workspaceId, userProfileId);

    if (!workspace) {
      throw new AppError("WORKSPACE_NOT_FOUND", "Workspace not found", 404);
    }

    return toDto(workspace);
  }

  async updateWorkspace(userProfileId: string, workspaceId: string, input: UpdateWorkspaceInput): Promise<WorkspaceDto> {
    const workspace = await this.repository.updateByIdForOwner(workspaceId, userProfileId, input);

    if (!workspace) {
      throw new AppError("WORKSPACE_NOT_FOUND", "Workspace not found", 404);
    }

    return toDto(workspace);
  }
}
