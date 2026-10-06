import express from "express";
import cors from "cors";
import productRoutes from "./modules/productos/productos.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import usuariosRoutes from "./modules/usuarios/usuarios.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import ventasRoutes from "./modules/ventas/ventas.routes.js";
import proveedoresRoutes from "./modules/proveedores/proveedores.routes.js";
import comprasRoutes from "./modules/compras/compras.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import empresaRoutes from "./modules/empresas/empresa.router.js";
import openaiRoutes from "./services/openai/openai.routes";
import pdfRoutes from "./services/pdf/pdf.routes";
import auditoriaRoutes from "./modules/auditoria/auditoria.routes.js";
import { movimientoRouter } from "./modules/movimientos-inventario/movimiento.router.js";
import "./events/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/productos", productRoutes);
app.use("/roles", rolesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/ventas", ventasRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/compras", comprasRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/empresa", empresaRoutes);
app.use("/auditoria", auditoriaRoutes);
app.use("/movimientos-inventario", movimientoRouter);
app.use("/openai", openaiRoutes);
app.use("/pdf", pdfRoutes);
app.use(errorMiddleware);

const port = 3000;

app.listen(port, () =>{
    console.log(`Servidor corriendo en puerto ${port}`)
});