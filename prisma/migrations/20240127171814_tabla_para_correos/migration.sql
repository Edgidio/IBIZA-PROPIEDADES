-- CreateTable
CREATE TABLE "correos" (
    "id" SERIAL NOT NULL,
    "correo_usuario" VARCHAR(100) NOT NULL,
    "asunto" VARCHAR(50) NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correos_pkey" PRIMARY KEY ("id")
);
