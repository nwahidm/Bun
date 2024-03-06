import { type NextFunction, type Request, type Response } from "express"
import { Research } from "../models/researches"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllResearches = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.body
    console.log("[FETCH ALL RESEARCH]", startDate, endDate)

    try {
        let where = {}
        if (startDate && endDate) {
            where = {...where, createdAt: {
                $gte: moment(startDate).startOf("day").format(),
                $lte: moment(endDate).endOf("day").format(),
              }}
        }

        const researchs = await Research.find(where).populate('warrantId').sort([['createdAt', 'desc']])

        for (let i of researchs) {
            (<any>i).warrantId.document = url + (<any>i).warrantId.document
        }

        res.status(200).json({
            status: 200,
            data: researchs
        })
    } catch (error) {
        next(error)
    }
}

export const createResearch = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantId, lapinsus, advice, follow_up, threats, interference, barrier, challenges } = req.body
    console.log("[CREATE RESEARCH]", warrantId, lapinsus, advice, follow_up, threats, interference, barrier, challenges)

    try {
        const newResearch = new Research({
            warrantId,
            lapinsus,
            advice,
            follow_up,
            threats,
            interference,
            barrier,
            challenges
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
        const research = await Research.findById(id).populate('warrantId')

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
    const { advice, follow_up, threats, interference, barrier, challenges } = req.body
    console.log("[UPDATE RESEARCH]", advice, follow_up, threats, interference, barrier, challenges)

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
        if (advice) updatedData = { ...updatedData, advice }
        if (follow_up) updatedData = { ...updatedData, follow_up }
        if (threats) updatedData = { ...updatedData, threats }
        if (interference) updatedData = { ...updatedData, interference }
        if (barrier) updatedData = { ...updatedData, barrier }
        if (challenges) updatedData = { ...updatedData, challenges }

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
