-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propietarios" (
    "cedula" INTEGER NOT NULL,
    "nombres" VARCHAR(60) NOT NULL,
    "apellidos" VARCHAR(60) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,

    CONSTRAINT "Propietarios_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Propiedades" (
    "id" SERIAL NOT NULL,
    "id_propietario" INTEGER NOT NULL,
    "descripcion" VARCHAR(100),
    "detalles" VARCHAR(100),
    "ubicacion" VARCHAR(100),
    "precio" INTEGER DEFAULT 0,
    "venta_renta" VARCHAR(1) DEFAULT 'V',
    "n_habitaciones" INTEGER DEFAULT 0,
    "n_banos" INTEGER DEFAULT 0,
    "superficie" DOUBLE PRECISION DEFAULT 0,
    "terreno" DOUBLE PRECISION DEFAULT 0,
    "tipo_propiedad" VARCHAR(1) NOT NULL,

    CONSTRAINT "Propiedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propiedades_img" (
    "id" SERIAL NOT NULL,
    "id_propiedad" INTEGER NOT NULL,
    "ruta_imagen_propiedad" VARCHAR(200) NOT NULL,
    "cantidad_img" INTEGER NOT NULL,

    CONSTRAINT "Propiedades_img_pkey" PRIMARY KEY ("id")
);
