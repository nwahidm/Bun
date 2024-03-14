import { type NextFunction, type Request, type Response } from "express"
import { Elicitation } from "../models/elicitations"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllElicitations = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL ELICITATIONS]", name, status, startDate, endDate)

    try {
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

        const elicitations = await Elicitation.find(where).populate('interviewId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: elicitations
        })
    } catch (error) {
        next(error)
    }
}

export const createElicitation = async (req: Request, res: Response, next: NextFunction) => {
    const { interviewId, name, record, advice, follow_up, result } = req.body
    console.log("[CREATE ELICITATION]", interviewId, name, record, advice, follow_up, result)

    try {
        const newElicitation = new Elicitation({
            interviewId,
            name,
            record,
            advice,
            follow_up,
            result,
            status: 0
        })

        await newElicitation.save()

        res.status(201).json({
            status: 201,
            message: "Elicitation Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchElicitationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH ELICITATION DETAIL]", id)

    try {
        //Check whether the elicitation exist or not
        const elicitation = await Elicitation.findById(id).populate('interviewId', 'name')

        if (!elicitation) {
            throw {
                name: "Not Found",
                message: "Elicitation tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: elicitation
        })
    } catch (error) {
        next(error)
    }
}

export const updateElicitation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, record, advice, follow_up, result, status } = req.body
    console.log("[UPDATE ELICITATION]", name, record, advice, follow_up, result, status)

    try {
        //Check whether the Elicitation exist or not
        const elicitation = await Elicitation.findById(_id)

        if (!elicitation) {
            throw {
                name: "Not Found",
                message: "Elicitation tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (record) updatedData = { ...updatedData, record }
        if (advice) updatedData = { ...updatedData, advice }
        if (follow_up) updatedData = { ...updatedData, follow_up }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Elicitation
        await Elicitation.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Elicitation dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteElicitation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE Elicitation]", _id);

    try {
        //Check whether the Elicitation exist or not
        const elicitation = await Elicitation.findById(_id)

        if (!elicitation) {
            throw {
                name: "Not Found",
                message: "Elicitation tidak ditemukan"
            }
        }

        await Elicitation.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Elicitation dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
