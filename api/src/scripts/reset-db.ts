import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

async function resetDatabase() {
  console.log("Iniciando reseteo total de la base de datos...");

  // 1. Truncar todas las tablas con RESTART IDENTITY y CASCADE
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "movimientos_inventario",
      "auditoria",
      "detalle_ventas",
      "ventas",
      "detalle_compras",
      "compras",
      "proveedores",
      "productos",
      "usuarios",
      "empresas",
      "roles"
    RESTART IDENTITY CASCADE;
  `);

  // 2. Asegurar que las secuencias de todas las tablas comiencen exactamente en 1
  const sequences = [
    "empresas_id_seq",
    "productos_id_seq",
    "roles_id_seq",
    "usuarios_id_seq",
    "ventas_id_seq",
    "detalle_ventas_id_seq",
    "proveedores_id_seq",
    "compras_id_seq",
    "detalle_compras_id_seq",
    "auditoria_id_seq",
    "movimientos_inventario_id_seq",
  ];

  for (const seq of sequences) {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq}" RESTART WITH 1;`);
  }

  // 3. Crear los 3 roles fundamentales del sistema (ID 1: Administrador, 2: Cajero, 3: Bodeguero)
  await prisma.$executeRawUnsafe(`
    INSERT INTO roles (id, nombre, activo) VALUES 
      (1, 'Administrador', true),
      (2, 'Cajero', true),
      (3, 'Bodeguero', true);
  `);
  // Ajustar la secuencia de roles para que el próximo ID sea 4
  await prisma.$executeRawUnsafe(`SELECT setval('roles_id_seq', 3, true);`);

  // 4. Crear el Super Usuario único
  const claveHash = await bcrypt.hash("Juanjose2026++", 10);
  
  const superUsuario = await prisma.usuario.create({
    data: {
      nombre: "Juan Jose",
      apellido: "Meneses Monsalve",
      correo: "juan_meneses82192@elpoli.edu.co",
      contrasena: claveHash,
      rolId: 1, // Administrador / Super Usuario
      activo: true,
      empresaId: null, // Sin empresa asignada (Super Usuario global)
    },
  });

  console.log("Super Usuario creado con éxito:");
  console.log({
    id: superUsuario.id,
    nombre: superUsuario.nombre,
    apellido: superUsuario.apellido,
    correo: superUsuario.correo,
    rolId: superUsuario.rolId,
    empresaId: superUsuario.empresaId,
  });

  // 5. Verificar conteos y estado final de la base de datos
  const countUsuarios = await prisma.usuario.count();
  const countEmpresas = await prisma.empresa.count();
  const countProductos = await prisma.producto.count();
  const countVentas = await prisma.venta.count();
  const countCompras = await prisma.compra.count();
  const countProveedores = await prisma.proveedor.count();
  const countAuditorias = await prisma.auditoria.count();
  const countMovimientos = await prisma.movimientoInventario.count();

  console.log("\n--- ESTADO FINAL DE LA BASE DE DATOS ---");
  console.log("Usuarios:", countUsuarios, "(Esperado: 1, ID = 1)");
  console.log("Empresas:", countEmpresas, "(Esperado: 0 - próximo ID será 1)");
  console.log("Productos:", countProductos, "(Esperado: 0 - próximo ID será 1)");
  console.log("Ventas:", countVentas, "(Esperado: 0 - próximo ID será 1)");
  console.log("Compras:", countCompras, "(Esperado: 0 - próximo ID será 1)");
  console.log("Proveedores:", countProveedores, "(Esperado: 0 - próximo ID será 1)");
  console.log("Auditorías:", countAuditorias, "(Esperado: 0 - próximo ID será 1)");
  console.log("Movimientos:", countMovimientos, "(Esperado: 0 - próximo ID será 1)");
}

resetDatabase()
  .catch((err) => {
    console.error("Error al resetear la base de datos:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
