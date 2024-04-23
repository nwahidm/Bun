import { type NextFunction, type Request, type Response } from "express"
import { Delineation } from "../models/delineations"
import moment from "moment"

export const fetchAllDelineations = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL DELINEATIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Delineation.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Delineation.countDocuments({ status: 1 })
        const totalFollowedUp = await Delineation.countDocuments({ status: 2 })

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

        const delineations = await Delineation.find(where).populate('observationId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, delineations }
        })
    } catch (error) {
        next(error)
    }
}

export const createDelineation = async (req: Request, res: Response, next: NextFunction) => {
    const { observationId, name, description, scenario } = req.body
    console.log("[CREATE DELINEATION]", observationId, name, description, scenario)

    try {
        const newDelineation = new Delineation({
            observationId,
            name,
            description,
            isValid: false,
            scenario,
            status: 0
        })

        await newDelineation.save()

        res.status(201).json({
            status: 201,
            message: "Delineation Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchDelineationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH DELINEATION DETAIL]", id)

    try {
        //Check whether the delineation exist or not
        const delineation = await Delineation.findById(id).populate('observationId', 'name')

        if (!delineation) {
            throw {
                name: "Not Found",
                message: "Delineation tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: delineation
        })
    } catch (error) {
        next(error)
    }
}

export const updateDelineation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, description, isValid, scenario, status } = req.body
    console.log("[UPDATE DELINEATION]", name, description, isValid, scenario, status)

    try {
        //Check whether the delineation exist or not
        const delineation = await Delineation.findById(_id)

        if (!delineation) {
            throw {
                name: "Not Found",
                message: "Delineation tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (description) updatedData = { ...updatedData, description }
        if (isValid) updatedData = { ...updatedData, isValid }
        if (scenario) updatedData = { ...updatedData, scenario }
        if (status) updatedData = { ...updatedData, status }

        //Update Delineation
        await Delineation.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Delineation dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteDelineation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE DELINEATION]", _id);

    try {
        //Check whether the delineation exist or not
        const delineation = await Delineation.findById(_id)

        if (!delineation) {
            throw {
                name: "Not Found",
                message: "Delineation tidak ditemukan"
            }
        }

        await Delineation.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Delineation dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
