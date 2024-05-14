import { type NextFunction, type Request, type Response } from "express"
import { Tapping } from "../models/tappings"
import moment from "moment"

export const fetchAllTappings = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL TAPPINGS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Tapping.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Tapping.countDocuments({ status: 1 })
        const totalFollowedUp = await Tapping.countDocuments({ status: 2 })

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

        const tappings = await Tapping.find(where).populate('intrusionId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, tappings }
        })
    } catch (error) {
        next(error)
    }
}

export const createTapping = async (req: Request, res: Response, next: NextFunction) => {
    const { intrusionId, name, information, signalData, result } = req.body
    console.log("[CREATE TAPPING]", intrusionId, name, information, signalData, result)

    try {
        const newTapping = new Tapping({
            intrusionId,
            name,
            information,
            signalData,
            result,
            status: 0
        })

        await newTapping.save()

        res.status(201).json({
            status: 201,
            message: "Tapping Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchTappingDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH TAPPING DETAIL]", id)

    try {
        //Check whether the tapping exist or not
        const tapping = await Tapping.findById(id).populate('intrusionId', 'name')

        if (!tapping) {
            throw {
                name: "Not Found",
                message: "Tapping tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: tapping
        })
    } catch (error) {
        next(error)
    }
}

export const updateTapping = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { intrusionId, name, information, signalData, result, status } = req.body
    console.log("[UPDATE TAPPING]", intrusionId, name, information, signalData, result, status)

    try {
        //Check whether the tapping exist or not
        const tapping = await Tapping.findById(_id)

        if (!tapping) {
            throw {
                name: "Not Found",
                message: "Tapping tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (information) updatedData = { ...updatedData, information }
        if (signalData) updatedData = { ...updatedData, signalData }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Tapping
        await Tapping.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Tapping dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTapping = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE TAPPING]", _id);

    try {
        //Check whether the tapping exist or not
        const tapping = await Tapping.findById(_id)

        if (!tapping) {
            throw {
                name: "Not Found",
                message: "Tapping tidak ditemukan"
            }
        }

        await Tapping.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Tapping dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
