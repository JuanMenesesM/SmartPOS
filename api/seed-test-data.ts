import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando semilla de datos...');

  const empresa = await prisma.empresa.findFirst();
  const admin = await prisma.usuario.findFirst({ where: { rolId: 1 } });
  
  if (!empresa || !admin) {
    console.error('No se encontró empresa o administrador.');
    process.exit(1);
  }

  console.log('Limpiando base de datos...');
  await prisma.movimientoInventario.deleteMany();
  await prisma.detalleVenta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.detalleCompra.deleteMany();
  await prisma.compra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.proveedor.deleteMany();

  console.log('Creando proveedores...');
  const proveedor1 = await prisma.proveedor.create({
    data: {
      nombre: 'Distribuidora del Valle',
      nit: '900.123.456-1',
      telefono: '3151234567',
      correo: 'ventas@delvalle.com',
      direccion: 'Av. Principal # 45-23',
      empresaId: empresa.id,
      activo: true,
    }
  });

  const productosData = [
    { codigo: 'P001', nombre: 'Coca Cola 600ml', precioVenta: 3500, stock: 50 },
    { codigo: 'P002', nombre: 'Empanada de Carne', precioVenta: 2500, stock: 120 },
    { codigo: 'P003', nombre: 'Hamburguesa Sencilla', precioVenta: 12000, stock: 30 },
    { codigo: 'P004', nombre: 'Papas Fritas Medianas', precioVenta: 4500, stock: 45 },
    { codigo: 'P005', nombre: 'Agua Manantial 500ml', precioVenta: 2000, stock: 80 },
    { codigo: 'P006', nombre: 'Cerveza Club Colombia', precioVenta: 4000, stock: 15 },
    { codigo: 'P007', nombre: 'Combo Hamburguesa', precioVenta: 18000, stock: 25 },
  ];

  const productos = [];
  for (const p of productosData) {
    const prod = await prisma.producto.create({
      data: {
        ...p,
        empresaId: empresa.id,
        activo: true,
      }
    });
    productos.push(prod);
    
    await prisma.movimientoInventario.create({
      data: {
        productoId: prod.id,
        usuarioId: admin.id,
        empresaId: empresa.id,
        tipo: 'AJUSTE',
        cantidad: p.stock,
        stockAnterior: 0,
        stockNuevo: p.stock,
        observacion: 'Inventario inicial (Semilla)',
      }
    });
  }

  await prisma.venta.create({
    data: {
      total: 18000 + 4000,
      metodoPago: 'EFECTIVO',
      usuarioId: admin.id,
      empresaId: empresa.id,
      detalles: {
        create: [
          { productoId: productos[6].id, cantidad: 1, precioUnitario: 18000, subtotal: 18000 },
          { productoId: productos[5].id, cantidad: 1, precioUnitario: 4000, subtotal: 4000 },
        ]
      }
    }
  });

  await prisma.venta.create({
    data: {
      total: 17000,
      metodoPago: 'TRANSFERENCIA',
      referencia: '4392',
      usuarioId: admin.id,
      empresaId: empresa.id,
      detalles: {
        create: [
          { productoId: productos[1].id, cantidad: 4, precioUnitario: 2500, subtotal: 10000 },
          { productoId: productos[0].id, cantidad: 2, precioUnitario: 3500, subtotal: 7000 },
        ]
      }
    }
  });

  await prisma.compra.create({
    data: {
      total: 3500 * 50 * 0.6,
      usuarioId: admin.id,
      proveedorId: proveedor1.id,
      empresaId: empresa.id,
      detalles: {
        create: [
          { productoId: productos[0].id, cantidad: 50, precioCompra: 3500 * 0.6, subtotal: 3500 * 50 * 0.6 }
        ]
      }
    }
  });

  console.log('Semilla completada exitosamente.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
