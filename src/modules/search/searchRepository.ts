const SEARCH_RESULT_LIMIT = 8;
const WORKSPACE_CANDIDATE_LIMIT = 100;

export type UserSearchRecord = {
  id: string;
  username: string | null;
  displayName: string | null;
};

export type WorkspaceSearchRecord = {
  id: string;
  name: string;
  visibility: "public";
  members: Array<{
    role: "owner" | "member";
    userProfile: {
      username: string | null;
    };
  }>;
};

export class SearchRepository {
  constructor(private readonly db: any) {}

  async searchUsers(query: string): Promise<UserSearchRecord[]> {
    return this.db.userProfile.findMany({
      where: {
        username: { not: null },
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
      },
      orderBy: [{ username: "asc" }],
      take: SEARCH_RESULT_LIMIT,
    });
  }

  async searchPublicWorkspaces(_query: string): Promise<WorkspaceSearchRecord[]> {
    return this.db.workspace.findMany({
      where: {
        visibility: "public",
      },
      include: {
        members: {
          where: { role: "owner" },
          include: {
            userProfile: {
              select: { username: true },
            },
          },
          take: 1,
        },
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      take: WORKSPACE_CANDIDATE_LIMIT,
    });
  }
}
