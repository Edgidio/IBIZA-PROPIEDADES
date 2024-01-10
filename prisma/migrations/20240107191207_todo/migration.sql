/*
  Warnings:

  - You are about to drop the column `cantidad_img` on the `Propiedades_img` table. All the data in the column will be lost.
  - You are about to drop the column `ruta_imagen_propiedad` on the `Propiedades_img` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Propiedades_img" DROP COLUMN "cantidad_img",
DROP COLUMN "ruta_imagen_propiedad",
ADD COLUMN     "ruta1" TEXT,
ADD COLUMN     "ruta10" TEXT,
ADD COLUMN     "ruta11" TEXT,
ADD COLUMN     "ruta12" TEXT,
ADD COLUMN     "ruta2" TEXT,
ADD COLUMN     "ruta3" TEXT,
ADD COLUMN     "ruta4" TEXT,
ADD COLUMN     "ruta5" TEXT,
ADD COLUMN     "ruta6" TEXT,
ADD COLUMN     "ruta7" TEXT,
ADD COLUMN     "ruta8" TEXT,
ADD COLUMN     "ruta9" TEXT;
