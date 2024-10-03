/*
  Warnings:

  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OccupationToSchool" DROP CONSTRAINT "_OccupationToSchool_B_fkey";

-- DropTable
DROP TABLE "School";

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "graduateCount" INTEGER NOT NULL DEFAULT 0,
    "graduatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "externalLinks" TEXT[],

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- Tambahkan fungsi untuk menghitung persentase
CREATE OR REPLACE FUNCTION calculate_graduate_percent()
RETURNS TRIGGER AS $$
BEGIN
  NEW."graduatePercent" := CASE
    WHEN NEW."studentCount" > 0 THEN (NEW."graduateCount"::FLOAT / NEW."studentCount") * 100
    ELSE 0
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Buat trigger untuk menghitung graduatePercent secara otomatis
CREATE TRIGGER update_graduate_percent
BEFORE INSERT OR UPDATE ON "schools"
FOR EACH ROW
EXECUTE FUNCTION calculate_graduate_percent();

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- AddForeignKey
ALTER TABLE "_OccupationToSchool" ADD CONSTRAINT "_OccupationToSchool_B_fkey" FOREIGN KEY ("B") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;