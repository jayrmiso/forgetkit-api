ALTER TABLE "WorkspaceMember" DROP CONSTRAINT "WorkspaceMember_workspaceId_fkey";
ALTER TABLE "GameConcept" DROP CONSTRAINT "GameConcept_workspaceId_fkey";
ALTER TABLE "GameBlueprint" DROP CONSTRAINT "GameBlueprint_workspaceId_fkey";

ALTER TABLE "Workspace" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "Workspace" ALTER COLUMN "id" TYPE VARCHAR(32) USING replace("id"::text, '-', '');

ALTER TABLE "WorkspaceMember" ALTER COLUMN "workspaceId" TYPE VARCHAR(32) USING replace("workspaceId"::text, '-', '');
ALTER TABLE "GameConcept" ALTER COLUMN "workspaceId" TYPE VARCHAR(32) USING replace("workspaceId"::text, '-', '');
ALTER TABLE "GameBlueprint" ALTER COLUMN "workspaceId" TYPE VARCHAR(32) USING replace("workspaceId"::text, '-', '');

ALTER TABLE "WorkspaceMember"
  ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GameConcept"
  ADD CONSTRAINT "GameConcept_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GameBlueprint"
  ADD CONSTRAINT "GameBlueprint_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
