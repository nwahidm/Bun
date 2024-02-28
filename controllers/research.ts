import { type NextFunction, type Request, type Response } from "express"
import { Research } from "../models/research"

export const fetchAllResearch = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[FETCH ALL RESEARCH]")

    try {
        const researchs = await Research.find()

        res.status(200).json({
            status: 200,
            data: researchs
        })
    } catch (error) {
        next(error)
    }
}

export const createResearch = async (req: Request, res: Response, next: NextFunction) => {
    const { lapinsus } = req.body
    console.log("[CREATE RESEARCH]", lapinsus)

    try {
        const newResearch = new Research({
            lapinsus
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
        const research = await Research.findById(id)

        if (!research) {
            throw {
                name: "Not Found",
                message: "Research tidak ditemukan"
            }
        }

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
