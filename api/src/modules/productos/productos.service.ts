import { prisma } from "../../config/prisma";
import { CreateProductoDTO } from  "./productos.dto"

export const crearProducto = async (data: CreateProductoDTO) => {
    const {codigo, nombre, precioVenta, stock} = data;

    if (precioVenta <= 0){
        throw new Error("El precio debe ser mayor a 0")
    }

    if (stock < 0){
        throw new Error("El stock no puede ser negativo")
    }

    return await prisma.producto.create({
        data: {
            codigo,
            nombre,
            precioVenta,
            stock
        },
    });
};

export const getProductos = async() =>{
    return await prisma.producto.findMany({
        where:{
            activo: true
        },
    });
};

export const listarProductoPorId = async (id: number) =>{
    const producto = await prisma.producto.findUnique({
        where: {
            id,
        }
    })

    if (!producto){
        throw new Error("Producto no encontrado");
    }

    return producto;
}

export const actualizarProducto = async(id:number, data: Partial<CreateProductoDTO>) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    })

    if (!producto){
        throw new Error("Producto no encontrado")
    }

    if (data.precioVenta !== undefined && data.precioVenta <= 0) {
        throw new Error("El precio debe ser mayor a 0");
    }

    if (data.stock !== undefined && data.stock < 0) {
        throw new Error("El stock no puede ser negativo");
    }

    return await prisma.producto.update({
        where: {
            id
        },
        data
    })
};

export const desactivarProducto = async(id: number) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    })
    if (!producto){
        throw new Error("Producto no encontrado")
    }

    if (!producto.activo) {
        throw new Error("Producto ya se encuentra desactivado")
    }

    return await prisma.producto.update({
        where: {
            id
        },
        data: {
            activo: false
        }
    })
}