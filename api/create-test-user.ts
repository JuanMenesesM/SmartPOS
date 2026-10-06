import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test1234", 10);
  
  // Ensure "Administrador" role exists or get it
  let rol = await prisma.rol.findFirst({ where: { nombre: "Administrador" } });
  if (!rol) {
      rol = await prisma.rol.create({ data: { nombre: "Administrador", activo: true } });
  }

  // Create default Empresa
  let empresa = await prisma.empresa.findFirst({ where: { nit: "900123456" } });
  if (!empresa) {
      empresa = await prisma.empresa.create({ data: { nombre: "Mi Empresa Default", nit: "900123456" } });
  }

  const usuario = await prisma.usuario.upsert({
    where: { correo: "test@smartpos.com" },
    update: {
      contrasena: hashedPassword,
      empresaId: empresa.id
    },
    create: {
      nombre: "Usuario",
      apellido: "Prueba",
      correo: "test@smartpos.com",
      contrasena: hashedPassword,
      rolId: rol.id,
      empresaId: empresa.id,
      activo: true
    }
  });

  console.log("Usuario de prueba y empresa creados con éxito:");
  console.log("- Correo: test@smartpos.com");
  console.log("- Contraseña: test1234");
  console.log("- Empresa:", empresa.nombre);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
