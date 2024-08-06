import { type NextFunction, type Request, type Response } from "express"
import { Research } from "../models/researches"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllResearches = async (req: Request, res: Response, next: NextFunction) => {
    const { name, status, startDate, endDate } = req.body
    console.log("[FETCH ALL RESEARCH]", name, status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Research.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Research.countDocuments({ status: 1 })
        const totalFollowedUp = await Research.countDocuments({ status: 2 })

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

        const researches = await Research.find(where).populate('caseId').populate('warrantId').sort([['createdAt', 'desc']])

        for (let i of researches) {
            if (!((<any>i).warrantId.document).startsWith(url)) {
                (<any>i).warrantId.document = url + (<any>i).warrantId.document;
            }
        }

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, researches }
        })
    } catch (error) {
        next(error)
    }
}

export const createResearch = async (req: Request, res: Response, next: NextFunction) => {
    const { caseId, warrantId, name, lapinsus, advice, follow_up, aghtType, aghtDescription } = req.body
    console.log("[CREATE RESEARCH]", caseId, name, lapinsus, advice, follow_up, aghtType, aghtDescription)

    try {
        const newResearch = new Research({
            caseId,
            warrantId,
            name,
            lapinsus,
            advice,
            follow_up,
            aghtType,
            aghtDescription,
            status: 0
        })

        await newResearch.save()

        res.status(201).json({
            status: 201,
            message: "Research Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchResearchDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH RESEARCH DETAIL]", id)

    try {
        //Check whether the research exist or not
        const research = await Research.findById(id).populate('caseId').populate('caseId').populate('warrantId')

        if (!research) {
            throw {
                name: "Not Found",
                message: "Research tidak ditemukan"
            }
        }

        (<any>research).warrantId.document = url + (<any>research).warrantId.document

        res.status(200).json({
            status: 200,
            data: research
        })
    } catch (error) {
        next(error)
    }
}

export const updateResearch = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { name, lapinsus, advice, follow_up, aghtType, aghtDescription, status } = req.body
    console.log("[UPDATE RESEARCH]", name, lapinsus, advice, follow_up, aghtType, aghtDescription, status)

    try {
        //Check whether the research exist or not
        const research = await Research.findById(_id)

        if (!research) {
            throw {
                name: "Not Found",
                message: "Research tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (name) updatedData = { ...updatedData, name }
        if (lapinsus) updatedData = { ...updatedData, lapinsus }
        if (advice) updatedData = { ...updatedData, advice }
        if (follow_up) updatedData = { ...updatedData, follow_up }
        if (aghtType) updatedData = { ...updatedData, aghtType }
        if (aghtDescription) updatedData = { ...updatedData, aghtDescription }
        if (status) updatedData = { ...updatedData, status }

        //Update Research
        await Research.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Research dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteResearch = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE RESEARCH]", _id);

    try {
        //Check whether the research exist or not
        const research = await Research.findById(_id)

        if (!research) {
            throw {
                name: "Not Found",
                message: "Research tidak ditemukan"
            }
        }

        await Research.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Research dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
