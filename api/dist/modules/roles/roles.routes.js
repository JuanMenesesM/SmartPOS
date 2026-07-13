"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roles_controller_1 = require("./roles.controller");
const router = express_1.default.Router();
router.get("/listar", roles_controller_1.listarRoles);
exports.default = router;
