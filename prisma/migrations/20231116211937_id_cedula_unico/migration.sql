/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `Propietarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Propietarios_cedula_key" ON "Propietarios"("cedula");
