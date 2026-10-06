/*
  Warnings:

  - You are about to drop the column `referenciaId` on the `movimientos_inventario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movimientos_inventario" DROP COLUMN "referenciaId",
ADD COLUMN     "origenId" INTEGER;
