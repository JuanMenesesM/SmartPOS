import { Request, Response, NextFunction } from "express"
import * as authService from "./auth.service"
import { MESSAGES } from "../../utils/constants";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body)
        return res.json({
            message: MESSAGES.SUCCESS.AUTH_EXITOSA,
            ...result
        })
    } catch(error) {
        // auth.service throws custom errors with status 401 usually, but let the global handler manage it
        const err = error as any;
        err.statusCode = 401;
        next(err);
    }
};