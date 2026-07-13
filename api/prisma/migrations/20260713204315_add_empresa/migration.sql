/*
  Warnings:

  - You are about to drop the column `precio` on the `productos` table. All the data in the column will be lost.
  - Added the required column `precioVenta` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "precio",
ADD COLUMN     "precioVenta" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "direccion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "proveedorId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_compras" (
    "id" SERIAL NOT NULL,
    "compraId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioCompra" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "detalle_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "logo" TEXT,
    "ciudad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_nit_key" ON "proveedores"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nit_key" ON "empresas"("nit");

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
