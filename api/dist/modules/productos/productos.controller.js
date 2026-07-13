"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.desactivarProducto = exports.actualizarProducto = exports.crearProducto = exports.listarProductoPorId = exports.listarProductos = void 0;
const productosService = __importStar(require("./productos.service"));
const listarProductos = async (req, res) => {
    try {
        const productos = await productosService.getProductos();
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
};
exports.listarProductos = listarProductos;
const listarProductoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const producto = await productosService.listarProductoPorId(id);
        res.json(producto);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.listarProductoPorId = listarProductoPorId;
const crearProducto = async (req, res) => {
    try {
        const producto = await productosService.crearProducto(req.body);
        res.json(producto);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.crearProducto = crearProducto;
const actualizarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const producto = await productosService.actualizarProducto(id, req.body);
        res.json(producto);
    }
    catch (error) {
        if (error.message.includes("no encontrado")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};
exports.actualizarProducto = actualizarProducto;
const desactivarProducto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const producto = await productosService.desactivarProducto(id);
        res.json(producto);
    }
    catch (error) {
        if (error.message.includes("no encontrado")) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.includes("desactivado")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al desactivar el producto" });
    }
};
exports.desactivarProducto = desactivarProducto;
