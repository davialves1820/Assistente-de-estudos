-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StudyPlan" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL DEFAULT 0;
