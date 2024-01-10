/*
  Warnings:

  - You are about to drop the column `ruta1` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta10` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta11` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta12` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta2` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta3` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta4` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta5` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta6` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta7` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta8` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta9` on the `Propiedades_img` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Propiedades_img" DROP COLUMN "ruta1",
DROP COLUMN "ruta10",
DROP COLUMN "ruta11",
DROP COLUMN "ruta12",
DROP COLUMN "ruta2",
DROP COLUMN "ruta3",
DROP COLUMN "ruta4",
DROP COLUMN "ruta5",
DROP COLUMN "ruta6",
DROP COLUMN "ruta7",
DROP COLUMN "ruta8",
DROP COLUMN "ruta9",
ADD COLUMN     "rutas" TEXT[];
