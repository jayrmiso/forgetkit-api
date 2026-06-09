CREATE TYPE "CameraView" AS ENUM ('unknown', 'top_down', 'side_scroller', 'isometric', 'first_person', 'third_person');

ALTER TABLE "Workspace"
  ADD COLUMN "gameTitle" TEXT,
  ADD COLUMN "genre" TEXT,
  ADD COLUMN "cameraView" "CameraView",
  ADD COLUMN "artDirection" TEXT,
  ADD COLUMN "targetResolution" TEXT,
  ADD COLUMN "defaultBiome" TEXT,
  ADD COLUMN "defaultStyle" TEXT,
  ADD COLUMN "currentFocus" TEXT,
  ADD COLUMN "nextMilestone" TEXT,
  ADD COLUMN "blockers" TEXT,
  ADD COLUMN "storageRootPath" TEXT,
  ADD COLUMN "godotProjectPath" TEXT,
  ADD COLUMN "namingConvention" TEXT;
