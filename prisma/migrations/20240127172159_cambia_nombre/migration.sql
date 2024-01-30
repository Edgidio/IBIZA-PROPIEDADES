/*
  Warnings:

  - You are about to drop the `correos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "correos";

-- CreateTable
CREATE TABLE "correos_ibiza" (
    "id" SERIAL NOT NULL,
    "correo_usuario" VARCHAR(100) NOT NULL,
    "asunto" VARCHAR(50) NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correos_ibiza_pkey" PRIMARY KEY ("id")
);
