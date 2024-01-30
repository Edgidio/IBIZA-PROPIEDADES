/*
  Warnings:

  - Added the required column `nombre` to the `correos_ibiza` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "correos_ibiza" ADD COLUMN     "nombre" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "log_sistema" (
    "id" SERIAL NOT NULL,
    "controlador" VARCHAR(100) NOT NULL,
    "error" VARCHAR(5000) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_sistema_pkey" PRIMARY KEY ("id")
);
