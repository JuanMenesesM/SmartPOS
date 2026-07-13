import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../utils/constants";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Error Global]:", err);

    const statusCode = err.statusCode || 400;
    const message = err.message || MESSAGES.ERROR.ERROR_SERVIDOR;

    return res.status(statusCode).json({
        message
    });
};
