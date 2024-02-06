import type mongoose from "mongoose"
import { type NextFunction, type Request, type Response } from "express"
import { LogActivity } from "../models/log_activities"
import type { JWTRequest } from "../middlewares/middlewares"

export type log = {
    activity: string,
    user_id: mongoose.Types.ObjectId,
    browser: string,
    os: string,
    ip: string
}

export const createLog = async (logData: log) => {
    const { activity, user_id, browser, os, ip } = logData
    console.log("[CREATE LOG ACTIVITY]", activity, user_id, browser, os, ip)

    try {
        const newLog = new LogActivity({
            activity,
            user_id,
            browser,
            os,
            ip
        })

        await newLog.save()

        return {
            message: "Sukses membuat log aktivitas"
        }
    } catch (error) {
        return error
    }
}

export const fetchAllLogs = async (req: Request, res: Response, next: NextFunction) => {
    const { activity, user_id, limit, offset } = req.body
    console.log("[FETCH ALL LOG ACTIVITIES]", activity, user_id)

    try {
        //Search Query
        let where = {}
        if (activity) where = { ...where, activity: { $regex: activity, $options: "i" } }
        if (user_id) where = { ...where, user_id }

        const logs = await LogActivity.find(where).skip(offset).limit(limit).populate("user_id", 'nama_lengkap')

        res.status(200).json({
            status: 200,
            data: logs
        })
    } catch (error) {
        next(error)
    }

}

export const fetchLogDetail = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[FETCH LOG DETAIL]", _id)

    try {
        //Check whether the log exists or not
        const targetLog = await LogActivity.findById(_id).populate("user_id", 'nama_lengkap')

        if (!targetLog) {
            throw {
                name: "Not Found",
                message: "Log tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: targetLog
        })

    } catch (error) {
        next(error)
    }
}

export const fetchAllLogsByProfile = async (req: JWTRequest, res: Response, next: NextFunction) => {
    console.log("[FETCH LOGS BY PROFILE]")
    
    try {
        //Check whether the log exists or not
        const myLog = await LogActivity.find({
            user_id: req.user?._id
        }).populate("user_id", 'nama_lengkap')

        res.status(200).json({
            status: 200,
            data: myLog
        })

    } catch (error) {
        next(error)
    }
}