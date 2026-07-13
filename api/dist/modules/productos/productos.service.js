"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desactivarProducto = exports.actualizarProducto = exports.listarProductoPorId = exports.getProductos = exports.crearProducto = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crearProducto = async (data) => {
    const { codigo, nombre, precio, stock } = data;
    if (precio <= 0) {
        throw new Error("El precio debe ser mayor a 0");
    }
    if (stock < 0) {
        throw new Error("El stock no puede ser negativo");
    }
    return await prisma.producto.create({
        data: {
            codigo,
            nombre,
            precio,
            stock
        },
    });
};
exports.crearProducto = crearProducto;
const getProductos = async () => {
    return await prisma.producto.findMany({
        where: {
            activo: true
        },
    });
};
exports.getProductos = getProductos;
const listarProductoPorId = async (id) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id,
        }
    });
    if (!producto) {
        throw new Error("Producto no encontrado");
    }
    return producto;
};
exports.listarProductoPorId = listarProductoPorId;
const actualizarProducto = async (id, data) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    });
    if (!producto) {
        throw new Error("Producto no encontrado");
    }
    if (data.precio !== undefined && data.precio <= 0) {
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
    });
};
exports.actualizarProducto = actualizarProducto;
const desactivarProducto = async (id) => {
    const producto = await prisma.producto.findUnique({
        where: {
            id
        }
    });
    if (!producto) {
        throw new Error("Producto no encontrado");
    }
    if (!producto.activo) {
        throw new Error("Producto ya se encuentra desactivado");
    }
    return await prisma.producto.update({
        where: {
            id
        },
        data: {
            activo: false
        }
    });
};
exports.desactivarProducto = desactivarProducto;
