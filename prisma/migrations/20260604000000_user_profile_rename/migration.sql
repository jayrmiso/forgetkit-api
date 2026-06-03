ALTER TABLE "Profile" RENAME TO "user_profile";
ALTER TABLE "WorkspaceMember" RENAME COLUMN "profileId" TO "userProfileId";

ALTER INDEX "Profile_username_key" RENAME TO "user_profile_username_key";
ALTER TABLE "user_profile" RENAME CONSTRAINT "Profile_pkey" TO "user_profile_pkey";
ALTER TABLE "WorkspaceMember" RENAME CONSTRAINT "WorkspaceMember_profileId_fkey" TO "WorkspaceMember_userProfileId_fkey";
ALTER INDEX "WorkspaceMember_workspaceId_profileId_key" RENAME TO "WorkspaceMember_workspaceId_userProfileId_key";
