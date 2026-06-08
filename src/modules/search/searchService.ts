import type { SearchQuery, SearchResultDto } from "./searchSchemas";
import type { UserSearchRecord, WorkspaceSearchRecord } from "./searchRepository";

const SEARCH_RESULT_LIMIT = 8;

export type SearchRepositoryLike = {
  searchUsers(query: string): Promise<UserSearchRecord[]>;
  searchPublicWorkspaces(query: string): Promise<WorkspaceSearchRecord[]>;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

function getSearchTokens(value: string) {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(" ") : [];
}

function isSubsequence(needle: string, haystack: string) {
  let needleIndex = 0;

  for (const char of haystack) {
    if (char === needle[needleIndex]) {
      needleIndex += 1;
    }

    if (needleIndex === needle.length) {
      return true;
    }
  }

  return false;
}

function tokenMatchesName(token: string, nameTokens: string[], compactName: string) {
  return (
    nameTokens.some((nameToken) => nameToken.includes(token)) ||
    compactName.includes(token) ||
    (token.length >= 4 && isSubsequence(token, compactName))
  );
}

function scoreWorkspaceMatch(query: string, workspaceName: string) {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedName = normalizeSearchText(workspaceName);
  const compactQuery = compactSearchText(query);
  const compactName = compactSearchText(workspaceName);
  const queryTokens = getSearchTokens(query);
  const nameTokens = getSearchTokens(workspaceName);

  if (!normalizedQuery || !compactQuery) {
    return null;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 0;
  }

  if (compactName.includes(compactQuery)) {
    return 1;
  }

  if (queryTokens.every((token) => tokenMatchesName(token, nameTokens, compactName))) {
    return 2;
  }

  return null;
}

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

function toWorkspaceResult(workspace: WorkspaceSearchRecord): SearchResultDto | null {
  const ownerUsername = workspace.members[0]?.userProfile.username ?? null;

  if (!ownerUsername) {
    return null;
  }

  return {
    type: "workspace",
    id: workspace.id,
    name: workspace.name,
    ownerUsername,
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

    const workspaceResults = workspaces
      .map((workspace, index) => ({
        index,
        matchScore: scoreWorkspaceMatch(input.query, workspace.name),
        result: toWorkspaceResult(workspace),
      }))
      .filter((item): item is { index: number; matchScore: number; result: SearchResultDto } => item.matchScore !== null && item.result !== null)
      .sort((first, second) => first.matchScore - second.matchScore || first.index - second.index)
      .slice(0, SEARCH_RESULT_LIMIT)
      .map((item) => item.result);

    return [...users.map(toUserResult).filter((result): result is SearchResultDto => result !== null), ...workspaceResults];
  }
}
