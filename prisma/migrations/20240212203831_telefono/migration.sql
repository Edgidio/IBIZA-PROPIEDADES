/*
  Warnings:

  - Added the required column `telefono` to the `correos_ibiza` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "correos_ibiza" ADD COLUMN     "telefono" VARCHAR(50) NOT NULL;
