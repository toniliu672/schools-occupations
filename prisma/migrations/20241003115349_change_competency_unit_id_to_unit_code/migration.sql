/*
  Warnings:

  - You are about to drop the `CompetencyUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Occupation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" DROP CONSTRAINT "_CompetencyUnitToOccupation_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" DROP CONSTRAINT "_CompetencyUnitToOccupation_B_fkey";

-- DropForeignKey
ALTER TABLE "_OccupationToSchool" DROP CONSTRAINT "_OccupationToSchool_A_fkey";

-- DropTable
DROP TABLE "CompetencyUnit";

-- DropTable
DROP TABLE "Occupation";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occupations" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "occupations_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "competency_units" (
    "unitCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "competency_units_pkey" PRIMARY KEY ("unitCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "occupations_name_key" ON "occupations"("name");

-- AddForeignKey
ALTER TABLE "_OccupationToSchool" ADD CONSTRAINT "_OccupationToSchool_A_fkey" FOREIGN KEY ("A") REFERENCES "occupations"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" ADD CONSTRAINT "_CompetencyUnitToOccupation_A_fkey" FOREIGN KEY ("A") REFERENCES "competency_units"("unitCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" ADD CONSTRAINT "_CompetencyUnitToOccupation_B_fkey" FOREIGN KEY ("B") REFERENCES "occupations"("code") ON DELETE CASCADE ON UPDATE CASCADE;
