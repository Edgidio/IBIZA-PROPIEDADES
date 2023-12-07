/*
  Warnings:

  - A unique constraint covering the columns `[usuario]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Made the column `descripcion` on table `Propiedades` required. This step will fail if there are existing NULL values in that column.
  - Made the column `detalles` on table `Propiedades` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ubicacion` on table `Propiedades` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Propiedades" ALTER COLUMN "descripcion" SET NOT NULL,
ALTER COLUMN "detalles" SET NOT NULL,
ALTER COLUMN "ubicacion" SET NOT NULL,
ALTER COLUMN "tipo_propiedad" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuario_key" ON "Usuarios"("usuario");

-- AddForeignKey
ALTER TABLE "Propiedades" ADD CONSTRAINT "Propiedades_id_propietario_fkey" FOREIGN KEY ("id_propietario") REFERENCES "Propietarios"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedades_img" ADD CONSTRAINT "Propiedades_img_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "Propiedades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
