import { type NextFunction, type Request, type Response } from "express"
import { Interrogation } from "../models/interrogations"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllInterrogations = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[FETCH ALL INTERROGATIONS]")

    try {
        const interrogations = await Interrogation.find().populate('warrantId').sort([['createdAt', 'desc']])

        for (let i of interrogations) {
            if (!((<any>i).warrantId.document).startsWith(url)) {
                (<any>i).warrantId.document = url + (<any>i).warrantId.document;
            }
        }

        res.status(200).json({
            status: 200,
            data: interrogations
        })
    } catch (error) {
        next(error)
    }
}

export const createInterrogation = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantId, record, targetIdentification, result } = req.body
    console.log("[CREATE INTERROGATION]", warrantId, record, targetIdentification, result)

    try {
        const newInterrogation = new Interrogation({
            warrantId,
            record,
            targetIdentification,
            result
        })

        await newInterrogation.save()

        res.status(201).json({
            status: 201,
            message: "Interrogation Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchInterrogationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH INTERROGATION DETAIL]", id)

    try {
        //Check whether the interrogation exist or not
        const interrogation = await Interrogation.findById(id).populate('warrantId')

        if (!interrogation) {
            throw {
                name: "Not Found",
                message: "Interrogation tidak ditemukan"
            }
        }

        (<any>interrogation).warrantId.document = url + (<any>interrogation).warrantId.document

        res.status(200).json({
            status: 200,
            data: interrogation
        })
    } catch (error) {
        next(error)
    }
}

export const updateInterrogation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { record, targetIdentification, result } = req.body
    console.log("[UPDATE INTERROGATION]", record, targetIdentification, result)

    try {
        //Check whether the interrogation exist or not
        const interrogation = await Interrogation.findById(_id)

        if (!interrogation) {
            throw {
                name: "Not Found",
                message: "Interrogation tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (record) updatedData = { ...updatedData, record }
        if (targetIdentification) updatedData = { ...updatedData, targetIdentification }
        if (result) updatedData = { ...updatedData, result }

        //Update Interrogation
        await Interrogation.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Interrogation dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteInterrogation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE INTERROGATION]", _id);

    try {
        //Check whether the Interrogation exist or not
        const interrogation = await Interrogation.findById(_id)

        if (!interrogation) {
            throw {
                name: "Not Found",
                message: "Interrogation tidak ditemukan"
            }
        }

        await Interrogation.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Interrogation dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
