import { type NextFunction, type Request, type Response } from "express"
import { Intrution } from "../models/intrutions"
import moment from "moment"

export const fetchAllIntrutions = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL INTRUTIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Intrution.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Intrution.countDocuments({ status: 1 })
        const totalFollowedUp = await Intrution.countDocuments({ status: 2 })

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

        const intrutions = await Intrution.find(where).populate('infiltrationId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, intrutions }
        })
    } catch (error) {
        next(error)
    }
}

export const createIntrution = async (req: Request, res: Response, next: NextFunction) => {
    const { infiltrationId, name, location, environment, result } = req.body
    console.log("[CREATE INTRUTION]", infiltrationId, name, location, environment, result)

    try {
        const newIntrution = new Intrution({
            infiltrationId,
            name,
            location,
            environment,
            result,
            status: 0
        })

        await newIntrution.save()

        res.status(201).json({
            status: 201,
            message: "Intrution Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchIntrutionDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH INTRUTION DETAIL]", id)

    try {
        //Check whether the intrution exist or not
        const intrution = await Intrution.findById(id).populate('infiltrationId', 'name')

        if (!intrution) {
            throw {
                name: "Not Found",
                message: "Intrution tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: intrution
        })
    } catch (error) {
        next(error)
    }
}

export const updateIntrution = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { infiltrationId, name, location, environment, result, status } = req.body
    console.log("[UPDATE INTRUTION]", infiltrationId, name, location, environment, result, status)

    try {
        //Check whether the intrution exist or not
        const intrution = await Intrution.findById(_id)

        if (!intrution) {
            throw {
                name: "Not Found",
                message: "Intrution tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (location) updatedData = { ...updatedData, location }
        if (environment) updatedData = { ...updatedData, environment }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Intrution
        await Intrution.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Intrution dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteIntrution = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE INTRUTION]", _id);

    try {
        //Check whether the intrution exist or not
        const intrution = await Intrution.findById(_id)

        if (!intrution) {
            throw {
                name: "Not Found",
                message: "Intrution tidak ditemukan"
            }
        }

        await Intrution.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Intrution dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
