import type { SearchQuery, SearchResultDto } from "./searchSchemas";
import type { UserSearchRecord, WorkspaceSearchRecord } from "./searchRepository";

export type SearchRepositoryLike = {
  searchUsers(query: string): Promise<UserSearchRecord[]>;
  searchPublicWorkspaces(query: string): Promise<WorkspaceSearchRecord[]>;
};

function toUserResult(user: UserSearchRecord): SearchResultDto | null {
  if (!user.username) {
    return null;
  }

  return {
    type: "user",
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  };
}

function toWorkspaceResult(workspace: WorkspaceSearchRecord): SearchResultDto {
  return {
    type: "workspace",
    id: workspace.id,
    name: workspace.name,
    ownerUsername: workspace.members[0]?.userProfile.username ?? null,
    visibility: "public",
  };
}

export class SearchService {
  constructor(private readonly repository: SearchRepositoryLike) {}

  async search(input: SearchQuery): Promise<SearchResultDto[]> {
    const includeUsers = input.types.includes("user");
    const includeWorkspaces = input.types.includes("workspace");
    const [users, workspaces] = await Promise.all([
      includeUsers ? this.repository.searchUsers(input.query) : Promise.resolve([]),
      includeWorkspaces ? this.repository.searchPublicWorkspaces(input.query) : Promise.resolve([]),
    ]);

    return [...users.map(toUserResult).filter((result): result is SearchResultDto => result !== null), ...workspaces.map(toWorkspaceResult)];
  }
}
