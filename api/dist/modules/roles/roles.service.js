"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarRoles = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listarRoles = async () => {
    return await prisma.rol.findMany();
};
exports.listarRoles = listarRoles;
