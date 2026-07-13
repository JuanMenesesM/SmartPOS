"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productos_controller_1 = require("./productos.controller");
const router = express_1.default.Router();
router.get("/", productos_controller_1.listarProductos);
router.get("/:id", productos_controller_1.listarProductoPorId);
router.post("/crear", productos_controller_1.crearProducto);
router.put("/actualizar/:id", productos_controller_1.actualizarProducto);
router.put("/desactivar/:id", productos_controller_1.desactivarProducto);
exports.default = router;
