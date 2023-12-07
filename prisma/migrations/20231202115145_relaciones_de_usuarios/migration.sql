/*
  Warnings:

  - Added the required column `updatedAt` to the `Propiedades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Propiedades_img` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Propietarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedades" 
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "Propiedades_img" 
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Propietarios" 
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuarios" 
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Propiedades" 
  ADD CONSTRAINT "Propiedades_usuarioId_fkey" 
  FOREIGN KEY ("usuarioId") 
  REFERENCES "Usuarios"("id") 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;
