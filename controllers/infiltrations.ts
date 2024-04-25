import { type NextFunction, type Request, type Response } from "express"
import { Infiltration } from "../models/infiltrations"
import moment from "moment"

export const fetchAllInfiltrations = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL INFILTRATIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Infiltration.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Infiltration.countDocuments({ status: 1 })
        const totalFollowedUp = await Infiltration.countDocuments({ status: 2 })

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

        const infiltrations = await Infiltration.find(where).populate('tailingId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, infiltrations }
        })
    } catch (error) {
        next(error)
    }
}

export const createInfiltration = async (req: Request, res: Response, next: NextFunction) => {
    const { tailingId, name, operationInformation, plan, targetDynamic, result } = req.body
    console.log("[CREATE INFILTRATION]", tailingId, name, operationInformation, plan, targetDynamic, result)

    try {
        const newInfiltration = new Infiltration({
            tailingId,
            name,
            operationInformation,
            plan,
            targetDynamic,
            result,
            status: 0
        })

        await newInfiltration.save()

        res.status(201).json({
            status: 201,
            message: "Infiltration Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchInfiltrationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH INFILTRATION DETAIL]", id)

    try {
        //Check whether the infiltration exist or not
        const infiltration = await Infiltration.findById(id).populate('tailingId', 'name')

        if (!infiltration) {
            throw {
                name: "Not Found",
                message: "Infiltration tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: infiltration
        })
    } catch (error) {
        next(error)
    }
}

export const updateInfiltration = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { tailingId, name, operationInformation, plan, targetDynamic, result, status } = req.body
    console.log("[UPDATE INFILTRATION]", tailingId, name, operationInformation, plan, targetDynamic, result, status)

    try {
        //Check whether the infiltration exist or not
        const infiltration = await Infiltration.findById(_id)

        if (!infiltration) {
            throw {
                name: "Not Found",
                message: "Infiltration tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (operationInformation) updatedData = { ...updatedData, operationInformation }
        if (plan) updatedData = { ...updatedData, plan }
        if (targetDynamic) updatedData = { ...updatedData, targetDynamic }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Infiltration
        await Infiltration.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Infiltration dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteInfiltration = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE INFILTRATION]", _id);

    try {
        //Check whether the infiltration exist or not
        const infiltration = await Infiltration.findById(_id)

        if (!infiltration) {
            throw {
                name: "Not Found",
                message: "Infiltration tidak ditemukan"
            }
        }

        await Infiltration.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Infiltration dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
