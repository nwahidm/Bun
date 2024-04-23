import { type NextFunction, type Request, type Response } from "express"
import { Exploration } from "../models/explorations"
import moment from "moment"

export const fetchAllExplorations = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL EXPLORATIONS]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Exploration.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Exploration.countDocuments({ status: 1 })
        const totalFollowedUp = await Exploration.countDocuments({ status: 2 })

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

        const explorations = await Exploration.find(where).populate('delineationId', 'name').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, explorations }
        })
    } catch (error) {
        next(error)
    }
}

export const createExploration = async (req: Request, res: Response, next: NextFunction) => {
    const { delineationId, name, plan, targetIdentity, result } = req.body
    console.log("[CREATE EXPLORATION]", delineationId, name, plan, targetIdentity, result)

    try {
        const newExploration = new Exploration({
            delineationId,
            name,
            plan,
            targetIdentity: {
                name: "",
                nation: "",
                IDCardNumber: ""
            },
            result,
            status: 0
        })

        await newExploration.save()

        res.status(201).json({
            status: 201,
            message: "Exploration Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchExplorationDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH EXPLORATION DETAIL]", id)

    try {
        //Check whether the exploration exist or not
        const exploration = await Exploration.findById(id).populate('delineationId', 'name')

        if (!exploration) {
            throw {
                name: "Not Found",
                message: "Exploration tidak ditemukan"
            }
        }

        exploration.plan.map((x) => {
            (<any>x).start = moment((<any>x).start).format('DD-MMMM-YYYY'),
                (<any>x).end = moment((<any>x).end).format('DD-MMMM-YYYY')
        })

        res.status(200).json({
            status: 200,
            data: exploration
        })
    } catch (error) {
        next(error)
    }
}

export const updateExploration = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, plan, targetIdentity, result, status } = req.body
    console.log("[UPDATE EXPLORATION]", name, plan, targetIdentity, result, status)

    try {
        //Check whether the exploration exist or not
        const exploration = await Exploration.findById(_id)

        if (!exploration) {
            throw {
                name: "Not Found",
                message: "Exploration tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (plan) {

            for (let i in plan) {
                plan[i].start = moment(plan[i].start).format()
                plan[i].end = moment(plan[i].end).format()
            }

            updatedData = { ...updatedData, plan }
        }
        if (targetIdentity) updatedData = { ...updatedData, targetIdentity }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

        //Update Exploration
        await Exploration.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Exploration dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteExploration = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE EXPLORATION]", _id);

    try {
        //Check whether the exploration exist or not
        const exploration = await Exploration.findById(_id)

        if (!exploration) {
            throw {
                name: "Not Found",
                message: "Exploration tidak ditemukan"
            }
        }

        await Exploration.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Exploration dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}

export const addPlan = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { newPlan } = req.body
    console.log("[ADD PLAN]", _id, newPlan);

    try {
        //Check whether the exploration exist or not
        const exploration = await Exploration.findById(_id)

        if (!exploration) {
            throw {
                name: "Not Found",
                message: "Exploration tidak ditemukan"
            }
        }

        await Exploration.updateOne(
            { _id },
            { $push: { plan: newPlan } },
        );

        res.status(200).json({
            status: 200,
            message: `Plan berhasil ditambahkan pada exploration dengan id ${_id}`
        })
    } catch (error) {
        next(error)
    }
}
