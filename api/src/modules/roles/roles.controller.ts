import { Request, Response, NextFunction } from "express"
import * as rolesService from "./roles.service"

export const listarRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await rolesService.listarRoles()
        return res.json(roles)
    } catch (error) {
        next(error)
    }
}
