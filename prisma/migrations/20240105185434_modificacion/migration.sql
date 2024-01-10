/*
  Warnings:

  - You are about to drop the column `admin` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `nombre_creador` to the `Propietarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propietarios" ADD COLUMN     "nombre_creador" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "admin";
