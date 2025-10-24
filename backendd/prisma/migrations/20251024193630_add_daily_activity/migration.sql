/*
  Warnings:

  - You are about to drop the `DailyActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DailyActivity" DROP CONSTRAINT "DailyActivity_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DailyActivity" DROP CONSTRAINT "DailyActivity_userId_fkey";

-- DropTable
DROP TABLE "public"."DailyActivity";
