import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("cliente123", 10);
  
  // Ensure "Administrador" role exists or get it
  let rol = await prisma.rol.findFirst({ where: { nombre: "Administrador" } });
  if (!rol) {
      rol = await prisma.rol.create({ data: { nombre: "Administrador", activo: true } });
  }

  // Create Client Empresa
  let empresa = await prisma.empresa.findFirst({ where: { nit: "123456789" } });
  if (!empresa) {
      empresa = await prisma.empresa.create({ data: { nombre: "La Tienda de Cliente", nit: "123456789" } });
  }

  const usuario = await prisma.usuario.upsert({
    where: { correo: "cliente@tienda.com" },
    update: {
      contrasena: hashedPassword,
      empresaId: empresa.id,
      rolId: rol.id
    },
    create: {
      nombre: "Juan",
      apellido: "Cliente",
      correo: "cliente@tienda.com",
      contrasena: hashedPassword,
      rolId: rol.id,
      empresaId: empresa.id,
      activo: true
    }
  });

  console.log("Usuario CLIENTE creado:");
  console.log("Correo: cliente@tienda.com");
  console.log("Clave: cliente123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
