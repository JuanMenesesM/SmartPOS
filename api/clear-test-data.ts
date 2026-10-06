import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando datos de prueba basura...");
  await prisma.movimientoInventario.deleteMany({});
  await prisma.detalleVenta.deleteMany({});
  await prisma.venta.deleteMany({});
  await prisma.detalleCompra.deleteMany({});
  await prisma.compra.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.proveedor.deleteMany({});
  console.log("¡Datos limpios! La base de datos ahora está vacía salvo por usuarios y empresas.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
