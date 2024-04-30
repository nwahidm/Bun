import { type NextFunction, type Request, type Response } from "express"
import { Intrusion } from "../models/intrusions"
import moment from "moment"

export const fetchAllIntrusions = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL INTRUSIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Intrusion.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Intrusion.countDocuments({ status: 1 })
        const totalFollowedUp = await Intrusion.countDocuments({ status: 2 })

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

        const intrusions = await Intrusion.find(where).populate('infiltrationId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, intrusions }
        })
    } catch (error) {
        next(error)
    }
}

export const createIntrusion = async (req: Request, res: Response, next: NextFunction) => {
    const { infiltrationId, name, location, environment, result } = req.body
    console.log("[CREATE INTRUSION]", infiltrationId, name, location, environment, result)

    try {
        const newIntrusion = new Intrusion({
            infiltrationId,
            name,
            location,
            environment,
            result,
            status: 0
        })

        await newIntrusion.save()

        res.status(201).json({
            status: 201,
            message: "Intrusion Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchIntrusionDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH INTRUSION DETAIL]", id)

    try {
        //Check whether the intrusion exist or not
        const intrusion = await Intrusion.findById(id).populate('infiltrationId', 'name')

        if (!intrusion) {
            throw {
                name: "Not Found",
                message: "Intrusion tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: intrusion
        })
    } catch (error) {
        next(error)
    }
}

export const updateIntrusion = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { infiltrationId, name, location, environment, result, status } = req.body
    console.log("[UPDATE INTRUSION]", infiltrationId, name, location, environment, result, status)

    try {
        //Check whether the intrusion exist or not
        const intrusion = await Intrusion.findById(_id)

        if (!intrusion) {
            throw {
                name: "Not Found",
                message: "Intrusion tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (location) updatedData = { ...updatedData, location }
        if (environment) updatedData = { ...updatedData, environment }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Intrusion
        await Intrusion.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Intrusion dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteIntrusion = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE INTRUSION]", _id);

    try {
        //Check whether the intrusion exist or not
        const intrusion = await Intrusion.findById(_id)

        if (!intrusion) {
            throw {
                name: "Not Found",
                message: "Intrusion tidak ditemukan"
            }
        }

        await Intrusion.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Intrusion dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
