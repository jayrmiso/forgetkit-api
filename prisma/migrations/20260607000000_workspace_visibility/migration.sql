CREATE TYPE "WorkspaceVisibility" AS ENUM ('private', 'unlisted', 'public');

ALTER TABLE "Workspace"
ADD COLUMN "visibility" "WorkspaceVisibility" NOT NULL DEFAULT 'private';
