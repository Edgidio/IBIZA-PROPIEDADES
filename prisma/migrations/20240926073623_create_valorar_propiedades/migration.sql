-- CreateTable
CREATE TABLE "ValorarPropiedades" (
    "id" SERIAL NOT NULL,
    "ubicacion" VARCHAR(100) NOT NULL,
    "numeroCasa" INTEGER,
    "tipoPropiedad" VARCHAR(50) NOT NULL,
    "plantaApartamento" VARCHAR(10),
    "puertaBloque" VARCHAR(10),
    "superficieConstruidaApartamento" DOUBLE PRECISION,
    "superficieConstruida" DOUBLE PRECISION,
    "areaTerreno" DOUBLE PRECISION,
    "numHabitaciones" INTEGER,
    "numBanios" INTEGER,
    "EstadoPropiedad" VARCHAR(100) NOT NULL,
    "caracteristica" TEXT[],
    "nombre" VARCHAR(50) NOT NULL,
    "Apellidos" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "contactar" TEXT[],

    CONSTRAINT "ValorarPropiedades_pkey" PRIMARY KEY ("id")
);
