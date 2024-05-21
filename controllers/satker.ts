import { type NextFunction, type Request, type Response } from "express"
import { Satker } from "../models/satker"
import moment from "moment"

export const fetchAllSatker = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
    console.log("[FETCH ALL SATKER]", name)

    try {

        let where = {}
        if (name) where = { ...where, name: { $regex: name, $options: 'i' } }

        const satker = await Satker.find(where).sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: satker
        })
    } catch (error) {
        next(error)
    }
}

export const createSatker = async (req: Request, res: Response, next: NextFunction) => {
    const { code, name, address, phoneNumber } = req.body
    console.log("[CREATE SATKER]", code, name, address, phoneNumber)

    try {
        const newSatker = new Satker({
            code,
            name,
            address,
            phoneNumber
        })

        await newSatker.save()

        res.status(201).json({
            status: 201,
            message: "Satker Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchSatkerDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH SATKER DETAIL]", id)

    try {
        //Check whether the satker exist or not
        const satker = await Satker.findById(id)

        if (!satker) {
            throw {
                name: "Not Found",
                message: "Satker tidak ditemukan"
            }
        }

        res.status(200).json({
            status: 200,
            data: satker
        })
    } catch (error) {
        next(error)
    }
}

export const updateSatker = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { code, name, address, phoneNumber } = req.body
    console.log("[UPDATE SATKER]", code, name, address, phoneNumber)

    try {
        //Check whether the Satker exist or not
        const satker = await Satker.findById(_id)

        if (!satker) {
            throw {
                name: "Not Found",
                message: "Satker tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (code) updatedData = { ...updatedData, code }
        if (name) updatedData = { ...updatedData, name }
        if (address) updatedData = { ...updatedData, address }
        if (phoneNumber) updatedData = { ...updatedData, phoneNumber }

        //Update Satker
        await Satker.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Satker dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteSatker = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE SATKER]", _id);

    try {
        //Check whether the satker exist or not
        const satker = await Satker.findById(_id)

        if (!satker) {
            throw {
                name: "Not Found",
                message: "Satker tidak ditemukan"
            }
        }

        await Satker.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Satker dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
