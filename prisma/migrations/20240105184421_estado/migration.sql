/*
  Warnings:

  - The `admin` column on the `Usuarios` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "admin",
ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;
