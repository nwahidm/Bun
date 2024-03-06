import { type NextFunction, type Request, type Response } from "express"
import { Interview } from "../models/interviews"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllInterviews = async (req: Request, res: Response, next: NextFunction) => {
    console.log("[FETCH ALL INTERVIEWS]")

    try {
        const interviews = await Interview.find().populate('warrantId').sort([['createdAt', 'desc']])

        for (let i of interviews) {
            (<any>i).warrantId.document = url + (<any>i).warrantId.document
        }

        res.status(200).json({
            status: 200,
            data: interviews
        })
    } catch (error) {
        next(error)
    }
}

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
    const { warrantId, schedule, advice, follow_up, result } = req.body
    console.log("[CREATE INTERVIEW]", warrantId, schedule, advice, follow_up, result)

    try {
        const newInterview = new Interview({
            warrantId,
            schedule: moment(schedule).format(),
            advice,
            follow_up,
            result
        })

        await newInterview.save()

        res.status(201).json({
            status: 201,
            message: "Interview Berhasil Dibuat"
        })
    } catch (error) {
        next(error)
    }
}

export const fetchInterviewDetail = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    console.log("[FETCH Interview DETAIL]", id)

    try {
        //Check whether the interview exist or not
        const interview = await Interview.findById(id).populate('warrantId')

        if (!interview) {
            throw {
                name: "Not Found",
                message: "Interview tidak ditemukan"
            }
        }

        (<any>interview).warrantId.document = url + (<any>interview).warrantId.document

        res.status(200).json({
            status: 200,
            data: interview
        })
    } catch (error) {
        next(error)
    }
}

export const updateInterview = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const { schedule, advice, follow_up, result } = req.body
    console.log("[UPDATE Interview]", schedule, advice, follow_up, result)

    try {
        //Check whether the interview exist or not
        const interview = await Interview.findById(_id)

        if (!interview) {
            throw {
                name: "Not Found",
                message: "Interview tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (schedule) updatedData = { ...updatedData, schedule: moment(schedule).format() }
        if (advice) updatedData = { ...updatedData, advice }
        if (follow_up) updatedData = { ...updatedData, follow_up }
        if (result) updatedData = { ...updatedData, result }

        //Update Interview
        await Interview.updateOne({ _id }, { $set: updatedData })

        res.status(200).json({
            status: 200,
            message: `Interview dengan id ${_id} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteInterview = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[DELETE INTERVIEW]", _id);

    try {
        //Check whether the Interview exist or not
        const interview = await Interview.findById(_id)

        if (!interview) {
            throw {
                name: "Not Found",
                message: "Interview tidak ditemukan"
            }
        }

        await Interview.deleteOne({ _id })

        res.status(200).json({
            status: 200,
            message: `Interview dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
