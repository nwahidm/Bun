import type { Request, Response, NextFunction } from "express";
import * as jose from "jose"
import type mongoose from "mongoose";

export type User = {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    avatar: string,
    browser: string,
    os: string,
    ip: string
}

export interface JWTRequest extends Request {
    user?: User
}

export const authMiddlewares = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const access_token = req.headers.authorization?.replace('Bearer ', '')
    try {
        if (!access_token) {
            throw {
                name: "Unauthorized",
                message: "Silakan login terlebih dahulu"
            }
        }

        const { payload } = await jose.jwtVerify(access_token, new TextEncoder().encode(Bun.env.secret))

        req.user = payload as User
        next()
    } catch (error) {
        next(error)
    }
}