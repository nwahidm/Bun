import { type NextFunction, type Request, type Response } from "express"
import { Warrant } from "../models/warrants"
import type { MulterFiles } from "./users"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllWarrants = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[FETCH ALL WARRANTS]")

    try {
        const warrants = await Warrant.find()
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
    const { warrantNumber, description, warrantType } = req.body
    let document
    if (req.files && (req.files as MulterFiles)['document']) {
        document = (req.files as MulterFiles)['document'][0].path
    }
    console.log("[CREATE WARRANT]", warrantNumber, description, document, warrantType)

    try {
        const newWarrant = new Warrant({
            warrantNumber,
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
        const warrant = await Warrant.findById(id)

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
    const { warrantNumber, description, warrantType } = req.body
    let document
    if (req.files && (req.files as MulterFiles)['document']) {
        document = (req.files as MulterFiles)['document'][0].path
    }
    console.log("[UPDATE WARRANT]", warrantNumber, description, document, warrantType)

    try {
        //Check whether the Warrant exist or not
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

        await Warrant.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Warrant dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
