/*
  Warnings:

  - Added the required column `admin` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedades" ADD COLUMN "estado" VARCHAR(100) NOT NULL DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN "admin" BOOLEAN NOT NULL DEFAULT false;

