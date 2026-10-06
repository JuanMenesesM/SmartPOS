import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando reseteo de datos...");

  // 1. Borrar detalles y ventas
  await prisma.detalleVenta.deleteMany({});
  await prisma.venta.deleteMany({});
  console.log("✓ Ventas y detalles eliminados.");

  // 2. Borrar detalles y compras
  await prisma.detalleCompra.deleteMany({});
  await prisma.compra.deleteMany({});
  console.log("✓ Compras y detalles eliminados.");

  // 3. Borrar movimientos de kardex y auditorías
  await prisma.movimientoInventario.deleteMany({});
  await prisma.auditoria.deleteMany({});
  console.log("✓ Kardex y auditoría reseteados.");

  // 4. Borrar productos
  await prisma.producto.deleteMany({});
  console.log("✓ Productos eliminados.");

  // 5. Verificar usuarios restantes
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, correo: true, nombre: true, rol: { select: { nombre: true } } },
  });
  console.log("✓ Usuarios conservados:", usuarios);
  console.log("¡Reseteo completado con éxito! El sistema está listo para pruebas desde 0.");
}

main()
  .catch((e) => {
    console.error("Error al resetear base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
