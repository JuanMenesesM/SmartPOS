"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productos_routes_js_1 = __importDefault(require("./modules/productos/productos.routes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/productos", productos_routes_js_1.default);
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
