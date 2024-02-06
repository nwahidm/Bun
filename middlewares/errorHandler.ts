import { type NextFunction, type Request, type Response } from "express"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    let status = 500
    let message = "Internal Server Error"

    if (error.name == "ValidationError") {
        status = 400
        message = error.message
    } else if (error.name == "Password Validation") {
        status = 400
        message = error.message        
    } else if (error.name == "Didn't Match") {
        status = 400
        message = error.message
    } else if (error.name == "Invalid") {
        status = 401
        message = error.message
    } else if (error.name == "Already Exist") {
        status = 401
        message = error.message
    } else if (error.name == "Not Active") {
        status = 401
        message = error.message
    } else if (error.name == "JWTExpired") {
        status = 401
        message = "Token Expired, Silakan lakukan login kembali"
    } else if (error.name == "Not Found") {
        status = 404
        message = error.message
    }

    res.status(status).json({ status, message })
}