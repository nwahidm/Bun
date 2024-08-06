import { type NextFunction, type Request, type Response } from "express"
import { Case } from "../models/cases"
import moment from "moment"

export const fetchAllCases = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, satkerId, caseType, startDate, endDate } = req.body
    console.log("[FETCH ALL CASES]", name, description, satkerId, caseType, startDate, endDate)

    try {
        let where = {}
        if (name) where = { ...where, name: { $regex: name, $options: 'i' } }
        if (description) where = { ...where, description: { $regex: description, $options: 'i' } }
        if (startDate && endDate) {
            where = {
                ...where, date: {
                    $gte: moment(startDate).startOf("day").format(),
                    $lte: moment(endDate).endOf("day").format(),
                }
            }
        }
        if (satkerId) where = { ...where, satkerId }
        if (caseType) where = { ...where, caseType }
        

        const Cases = await Case.find(where).populate('satkerId').sort([['createdAt', 'desc']])
        const totalOpenCase = await Case.countDocuments({ CaseType: 0 })
        const totalCloseCase = await Case.countDocuments({ CaseType: 1 })

        res.status(200).json({
            status: 200,
            data: { totalOpenCase, totalCloseCase, Cases }
        })
    } catch (error) {
        next(error)
    }
}

export const createCase = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, date, satkerId, caseType } = req.body
    console.log("[CREATE CASE]", name, description, date, satkerId, caseType)

    try {
        const newCase = new Case({
            name,
            description,
            date,
            satkerId,
            caseType,
            status: 0
        })

        await newCase.save()

        res.status(201).json({
            status: 201,
            message: "Case Berhasil Dibuat"
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const fetchCaseDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH CASE DETAIL]", id)

    try {
        //Check whether the case exist or not
        const targetCase = await Case.findById(id).populate('satkerId')

        if (!targetCase) {
            throw {
                name: "Not Found",
                message: "Case tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: targetCase
        })
    } catch (error) {
        next(error)
    }
}

export const updateCase = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, description, date, satkerId, caseType, status } = req.body
    console.log("[UPDATE CASE]", name, description, date, satkerId, caseType, status)

    try {
        //Check whether the case exist or not
        const targetCase = await Case.findById(_id)

        if (!targetCase) {
            throw {
                name: "Not Found",
                message: "Case tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (description) updatedData = { ...updatedData, description }
        if (date) updatedData = { ...updatedData, date: moment(date).format() }
        if (satkerId) updatedData = { ...updatedData, satkerId }
        if (caseType) updatedData = { ...updatedData, caseType }
        if (status) updatedData = { ...updatedData, status }

        //Update Case
        await Case.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Case dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteCase = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE CASE]", _id);

    try {
        //Check whether the case exist or not
        const targetCase = await Case.findById(_id)

        if (!targetCase) {
            throw {
                name: "Not Found",
                message: "Case tidak ditemukan"
            }
        }

        await Case.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Case dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
