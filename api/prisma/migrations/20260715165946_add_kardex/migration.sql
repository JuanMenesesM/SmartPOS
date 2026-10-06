/*
  Warnings:

  - You are about to drop the column `referencia` on the `movimientos_inventario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movimientos_inventario" DROP COLUMN "referencia",
ADD COLUMN     "referenciaId" INTEGER;
