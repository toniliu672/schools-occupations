-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "graduateCount" INTEGER NOT NULL DEFAULT 0,
    "graduatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "externalLinks" TEXT[],

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occupation" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CompetencyUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CompetencyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OccupationToSchool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompetencyUnitToOccupation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_name_key" ON "Occupation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_OccupationToSchool_AB_unique" ON "_OccupationToSchool"("A", "B");

-- CreateIndex
CREATE INDEX "_OccupationToSchool_B_index" ON "_OccupationToSchool"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetencyUnitToOccupation_AB_unique" ON "_CompetencyUnitToOccupation"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetencyUnitToOccupation_B_index" ON "_CompetencyUnitToOccupation"("B");

-- AddForeignKey
ALTER TABLE "_OccupationToSchool" ADD CONSTRAINT "_OccupationToSchool_A_fkey" FOREIGN KEY ("A") REFERENCES "Occupation"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OccupationToSchool" ADD CONSTRAINT "_OccupationToSchool_B_fkey" FOREIGN KEY ("B") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" ADD CONSTRAINT "_CompetencyUnitToOccupation_A_fkey" FOREIGN KEY ("A") REFERENCES "CompetencyUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyUnitToOccupation" ADD CONSTRAINT "_CompetencyUnitToOccupation_B_fkey" FOREIGN KEY ("B") REFERENCES "Occupation"("code") ON DELETE CASCADE ON UPDATE CASCADE;
