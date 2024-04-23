import { type NextFunction, type Request, type Response } from "express"
import { Tailing } from "../models/tailings"
import moment from "moment"

export const fetchAllTailings = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL TAILINGS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Tailing.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Tailing.countDocuments({ status: 1 })
        const totalFollowedUp = await Tailing.countDocuments({ status: 2 })

        let where = {}
        if (name) where = { ...where, name: { $regex: name, $options: 'i' } }
        if (status) where = { ...where, status }
        if (startDate && endDate) {
            where = {
                ...where, createdAt: {
                    $gte: moment(startDate).startOf("day").format(),
                    $lte: moment(endDate).endOf("day").format(),
                }
            }
        }

        const tailings = await Tailing.find(where).populate('explorationId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, tailings }
        })
    } catch (error) {
        next(error)
    }
}

export const createTailing = async (req: Request, res: Response, next: NextFunction) => {
    const { explorationId, name, result } = req.body
    console.log("[CREATE TAILING]", explorationId, name, result)

    try {
        const newtailing = new Tailing({
            explorationId,
            name,
            result,
            status: 0
        })

        await newtailing.save()

        res.status(201).json({
            status: 201,
            message: "Tailing Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchTailingDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH TAILING DETAIL]", id)

    try {
        //Check whether the tailing exist or not
        const tailing = await Tailing.findById(id).populate('explorationId', 'name')

        if (!tailing) {
            throw {
                name: "Not Found",
                message: "Tailing tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: tailing
        })
    } catch (error) {
        next(error)
    }
}

export const updateTailing = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, result, status } = req.body
    console.log("[UPDATE TAILING]", name, result, status)

    try {
        //Check whether the tailing exist or not
        const tailing = await Tailing.findById(_id)

        if (!tailing) {
            throw {
                name: "Not Found",
                message: "Tailing tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update tailing
        await Tailing.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Tailing dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTailing = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE TAILING]", _id);

    try {
        //Check whether the tailing exist or not
        const tailing = await Tailing.findById(_id)

        if (!tailing) {
            throw {
                name: "Not Found",
                message: "tailing tidak ditemukan"
            }
        }

        await Tailing.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Tailing dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
