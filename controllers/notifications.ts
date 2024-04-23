import { type NextFunction, type Request, type Response } from "express"
import { Notification } from "../models/notifications"
import { User } from "../models/users"
import type { MulterFiles } from "./users"
import type { JWTRequest } from "../middlewares/middlewares"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllNotification = async (req: Request, res: Response, next: NextFunction) => {
    const { judul, startDate, endDate } = req.body
    console.log("[FETCH ALL NOTIFICATIONS]", judul, startDate, endDate)

    try {
        let where = {}
        if (judul) where = { ...where, judul: { $regex: judul, $options: 'i' } }
        if (startDate && endDate) {
            where = {...where, createdAt: {
                $gte: moment(startDate).startOf("day").format(),
                $lte: moment(endDate).endOf("day").format(),
              }}
        }

        const notifications = await Notification.find(where).sort([['createdAt', 'desc']])

        for (let i of notifications) {
            i.foto = url + i.foto
        }

        res.status(200).json({
            status: 200,
            data: notifications
        })
    } catch (error) {
        next(error)
    }
}

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    const { judul, isi, kewenangan_id } = req.body
    let foto, kewenangans
    if (req.files && (req.files as MulterFiles)['foto']) {
        foto = (req.files as MulterFiles)['foto'][0].path
    }
    if (kewenangan_id) {
        kewenangans = JSON.parse(kewenangan_id)
    }
    console.log("[CREATE NOTIFICATION]", judul, isi, foto, kewenangans)

    try {

        const newNotification = new Notification({
            judul,
            isi,
            foto
        })

        await newNotification.save()

        for (let i of kewenangans) {
            const where = {
                kewenangan_id: i
            }

            const newNotif = {
                notification_id: newNotification._id,
                isRead: false
            }

            await User.updateMany(where, { $push: { notifications: newNotif } })
        }


        res.status(201).json({
            status: 201,
            message: "Notifikasi berhasil dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchNotificationDetail = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { _id } = req.user!
    const id = req.params.id
    console.log("[FETCH NOTIFICATION DETAIL]", id)

    try {
        const notification = await Notification.findById(id)

        if (!notification) {
            throw {
                name: "Not Found",
                message: "Notification tidak ditemukan"
            }
        }

        notification.foto = url + notification.foto

        await User.updateOne({ _id, 'notifications.notification_id': id }, { $set: { 'notifications.$.isRead': true } })

        res.status(200).json({
            status: 200,
            data: notification
        })
    } catch (error) {
        next(error)
    }
}

export const fetchUserNotification = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { _id } = req.user!
    console.log('[FETCH USER NOTIFICATION]')

    try {
        const userNotification = await User.findById(_id)
        const notifications = userNotification!.notifications

        let notificationsData = []
        let totalNotification = 0
        for (let i of notifications) {
            if (i.isRead == false) {
                totalNotification++
            }

            const targetNotification = await Notification.findById(i.notification_id)
            targetNotification!.foto = url + targetNotification!.foto
            targetNotification!.isRead = i.isRead
            notificationsData.push(targetNotification)
        }

        res.status(200).json({
            status: 200,
            data: { notificationsData, totalNotification }
        })
    } catch (error) {
        next(error)
    }
}
