-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "city" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bhk" TEXT,
    "purpose" TEXT NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timeline" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "notes" VARCHAR(1000),
    "tags" TEXT[],
    "ownerId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);
