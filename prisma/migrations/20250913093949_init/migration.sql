/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Buyer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "fullName" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "notes" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "public"."Buyer"("email");
