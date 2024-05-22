import { type NextFunction, type Request, type Response } from "express"
import { Warrant } from "../models/warrants"
import type { MulterFiles } from "./users"
import moment from "moment"
import { Research } from "../models/researches"
import { Interview } from "../models/interviews"
import { Interrogation } from "../models/interrogations"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllWarrants = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantNumber, satkerId, description, warrantType, startDate, endDate } = req.body
    console.log("[FETCH ALL WARRANTS]", warrantNumber, satkerId, description, warrantType)

    try {
        let where = {}
        if (warrantNumber) where = { ...where, warrantNumber: { $regex: warrantNumber, $options: 'i' } }
        if (satkerId) where = { ...where, satkerId }
        if (description) where = { ...where, description: { $regex: description, $options: 'i' } }
        if (warrantType) where = { ...where, warrantType }
        if (startDate && endDate) {
            where = {
                ...where, createdAt: {
                    $gte: moment(startDate).startOf("day").format(),
                    $lte: moment(endDate).endOf("day").format(),
                }
            }
        }

        const warrants = await Warrant.find(where).populate('satkerId').sort([['createdAt', 'desc']])
        const totalOpenWarrant = await Warrant.countDocuments({ warrantType: 0 })
        const totalCloseWarrant = await Warrant.countDocuments({ warrantType: 1 })

        for (let i of warrants) {
            i.document = url + i.document
        }

        res.status(200).json({
            status: 200,
            data: { totalOpenWarrant, totalCloseWarrant, warrants }
        })
    } catch (error) {
        next(error)
    }
}

export const createWarrant = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantNumber, satkerId, description, warrantType } = req.body
    let document
    if (req.files && (req.files as MulterFiles)['document']) {
        document = (req.files as MulterFiles)['document'][0].path
    }
    console.log("[CREATE WARRANT]", warrantNumber, satkerId, description, document, warrantType)

    try {
        const newWarrant = new Warrant({
            warrantNumber,
            satkerId,
            description,
            document,
            warrantType
        })

        await newWarrant.save()

        res.status(201).json({
            status: 201,
            message: "Warrant Berhasil Dibuat"
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const fetchWarrantDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH WARRANT DETAIL]", id)

    try {
        //Check whether the warrant exist or not
        const warrant = await Warrant.findById(id).populate('satkerId')

        if (!warrant) {
            throw {
                name: "Not Found",
                message: "Warrant tidak ditemukan"
            }
        }

        warrant.document = url + warrant.document

        res.status(200).json({
            status: 200,
            data: warrant
        })
    } catch (error) {
        next(error)
    }
}

export const updateWarrant = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { warrantNumber, satkerId, description, warrantType } = req.body
    let document
    if (req.files && (req.files as MulterFiles)['document']) {
        document = (req.files as MulterFiles)['document'][0].path
    }
    console.log("[UPDATE WARRANT]", warrantNumber, satkerId, description, document, warrantType)

    try {
        //Check whether the warrant exist or not
        const warrant = await Warrant.findById(_id)

        if (!warrant) {
            throw {
                name: "Not Found",
                message: "Warrant tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (warrantNumber) updatedData = { ...updatedData, warrantNumber }
        if (satkerId) updatedData = { ...updatedData, satkerId }
        if (description) updatedData = { ...updatedData, description }
        if (document) updatedData = { ...updatedData, document }
        if (warrantType) updatedData = { ...updatedData, warrantType }

        //Update Warrant
        await Warrant.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Warrant dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteWarrant = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE Warrant]", _id);

    try {
        //Check whether the warrant exist or not
        const warrant = await Warrant.findById(_id)

        if (!warrant) {
            throw {
                name: "Not Found",
                message: "Warrant tidak ditemukan"
            }
        }

        // const researchs = await Research.find({ warrantId: _id })

        // if (researchs) {
        //     throw {
        //         name: "Forbidden",
        //         message: "Warrant tersebut digunakan di salah satu penelitian"
        //     }
        // }

        // const interviews = await Interview.find({ warrantId: _id })

        // if (interviews) {
        //     throw {
        //         name: "Forbidden",
        //         message: "Warrant tersebut digunakan di salah satu interview"
        //     }
        // }

        // const interrogations = await Interrogation.find({ warrantId: _id })

        // if (interrogations) {
        //     throw {
        //         name: "Forbidden",
        //         message: "Warrant tersebut digunakan di salah satu interogasi"
        //     }
        // }

        await Warrant.deleteOne({ _id })
        await Research.deleteMany({warrantId: _id})
        await Interview.deleteMany({warrantId: _id})
        await Interrogation.deleteMany({warrantId: _id})

        res.status(200).json({
            status: 200,
            message: `Warrant dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
