import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Primero encontramos los usuarios a eliminar
  const usuariosAEliminar = await prisma.usuario.findMany({
    where: { correo: { not: "cliente@tienda.com" } },
    select: { id: true }
  });

  const ids = usuariosAEliminar.map(u => u.id);
  console.log(`Usuarios a eliminar (ids): ${ids}`);

  // Borramos las auditorías relacionadas
  await prisma.auditoria.deleteMany({ where: { usuarioId: { in: ids } } });
  await prisma.movimientoInventario.deleteMany({ where: { usuarioId: { in: ids } } });

  // Ahora sí borramos los usuarios
  const deleted = await prisma.usuario.deleteMany({
    where: { correo: { not: "cliente@tienda.com" } }
  });

  console.log(`Usuarios eliminados: ${deleted.count}`);

  const restantes = await prisma.usuario.findMany({ select: { correo: true, nombre: true } });
  console.log("Usuarios restantes:", restantes);
}

main().catch(console.error).finally(() => prisma.$disconnect());
