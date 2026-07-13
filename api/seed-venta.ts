import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVenta() {
    console.log("Iniciando creación de datos de prueba...");

    // 1. Asegurar que tenemos un usuario Admin
    const usuario = await prisma.usuario.findFirst();
    if (!usuario) {
        throw new Error("No hay usuarios en la base de datos. ¡Corre primero el login/seed del admin!");
    }

    // 2. Crear un par de productos de prueba
    const p1 = await prisma.producto.create({
        data: {
            codigo: "ZAP-001",
            nombre: "Zapatos Nike Air Max",
            precioVenta: 350000,
            stock: 10
        }
    });

    const p2 = await prisma.producto.create({
        data: {
            codigo: "CAM-001",
            nombre: "Camiseta Deportiva Adidas",
            precioVenta: 85000,
            stock: 20
        }
    });

    console.log("✅ Productos creados.");

    // 3. Crear la Venta simulando el Service
    const cantidadP1 = 1;
    const cantidadP2 = 2;
    const subtotalP1 = cantidadP1 * p1.precioVenta;
    const subtotalP2 = cantidadP2 * p2.precioVenta;
    const total = subtotalP1 + subtotalP2;

    const venta = await prisma.venta.create({
        data: {
            usuarioId: usuario.id,
            total,
            detalles: {
                create: [
                    {
                        productoId: p1.id,
                        cantidad: cantidadP1,
                        precioUnitario: p1.precioVenta,
                        subtotal: subtotalP1
                    },
                    {
                        productoId: p2.id,
                        cantidad: cantidadP2,
                        precioUnitario: p2.precioVenta,
                        subtotal: subtotalP2
                    }
                ]
            }
        }
    });

    console.log(`✅ ¡Venta creada con éxito! ID de la venta: ${venta.id}`);
    console.log(`Prueba generar el PDF en: http://localhost:3000/ventas/${venta.id}/pdf`);
}

seedVenta()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
