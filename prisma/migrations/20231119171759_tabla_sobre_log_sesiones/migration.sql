-- CreateTable
CREATE TABLE "log_sesiones" (
    "id" SERIAL NOT NULL,
    "direccion_IP" VARCHAR(200) NOT NULL,
    "usuario" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sesion" BOOLEAN NOT NULL,

    CONSTRAINT "log_sesiones_pkey" PRIMARY KEY ("id")
);
