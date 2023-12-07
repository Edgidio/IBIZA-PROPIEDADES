/*
  Warnings:

  - You are about to alter the column `tipo_propiedad` on the `Propiedades` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(1)`.

*/
-- AlterTable
ALTER TABLE "Propiedades" ALTER COLUMN "tipo_propiedad" SET DATA TYPE VARCHAR(1);
