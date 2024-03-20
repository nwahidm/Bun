import { type NextFunction, type Request, type Response } from "express"
import { Observation } from "../models/observations"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllObservations = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL OBSERVATIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Observation.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Observation.countDocuments({ status: 1 })
        const totalFollowedUp = await Observation.countDocuments({ status: 2 })

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

        const observations = await Observation.find(where).populate('warrantId').sort([['createdAt', 'desc']])

        for (let i of observations) {
            if (!((<any>i).warrantId.document).startsWith(url)) {
                (<any>i).warrantId.document = url + (<any>i).warrantId.document;
            }
        }

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, observations }
        })
    } catch (error) {
        next(error)
    }
}

export const createObservation = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantId, name, result, threats, interference, barrier, challenges } = req.body
    console.log("[CREATE OBSERVATION]", warrantId, name, result, threats, interference, barrier, challenges)

    try {
        const newObservation = new Observation({
            warrantId,
            name,
            result,
            threats,
            interference,
            barrier,
            challenges,
            status: 0
        })

        await newObservation.save()

        res.status(201).json({
            status: 201,
            message: "Observation Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchObservationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH OBSERVATION DETAIL]", id)

    try {
        //Check whether the observation exist or not
        const observation = await Observation.findById(id).populate('warrantId')

        if (!observation) {
            throw {
                name: "Not Found",
                message: "Observation tidak ditemukan"
            }
        }

        (<any>observation).warrantId.document = url + (<any>observation).warrantId.document

        res.status(200).json({
            status: 200,
            data: observation
        })
    } catch (error) {
        next(error)
    }
}

export const updateObservation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, result, threats, interference, barrier, challenges, status } = req.body
    console.log("[UPDATE OBSERVATION]", name, result, threats, interference, barrier, challenges, status)

    try {
        //Check whether the observation exist or not
        const observation = await Observation.findById(_id)

        if (!observation) {
            throw {
                name: "Not Found",
                message: "Observation tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (result) updatedData = { ...updatedData, result }
        if (threats) updatedData = { ...updatedData, threats }
        if (interference) updatedData = { ...updatedData, interference }
        if (barrier) updatedData = { ...updatedData, barrier }
        if (challenges) updatedData = { ...updatedData, challenges }
        if (status) updatedData = { ...updatedData, status }

        //Update Observation
        await Observation.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Observation dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteObservation = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE OBSERVATION]", _id);

    try {
        //Check whether the observation exist or not
        const observation = await Observation.findById(_id)

        if (!observation) {
            throw {
                name: "Not Found",
                message: "Observation tidak ditemukan"
            }
        }

        await Observation.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Observation dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
