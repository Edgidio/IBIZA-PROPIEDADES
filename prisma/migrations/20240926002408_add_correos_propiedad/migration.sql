-- CreateTable
CREATE TABLE "correos_propiedad" (
    "id" SERIAL NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(50) NOT NULL,
    "idPropiedad" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correos_propiedad_pkey" PRIMARY KEY ("id")
);
