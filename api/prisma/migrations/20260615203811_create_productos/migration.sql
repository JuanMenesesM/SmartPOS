-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_key" ON "productos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_nombre_key" ON "productos"("nombre");
