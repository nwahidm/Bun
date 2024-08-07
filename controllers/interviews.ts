import { type NextFunction, type Request, type Response } from "express"
import { Interview } from "../models/interviews"
import moment from "moment"
const url = "http://paket2.kejaksaan.info:5025/"

export const fetchAllInterviews = async (req: Request, res: Response, next: NextFunction) => {
    const { status, startDate, endDate } = req.body
    console.log("[FETCH ALL INTERVIEWS]", status, startDate, endDate)

    try {
        const totalNotYetFollowedUp = await Interview.countDocuments({ status: 0 })
        const totalBeingFollowedUp = await Interview.countDocuments({ status: 1 })
        const totalFollowedUp = await Interview.countDocuments({ status: 2 })

        let where = {}
        if (status) where = { ...where, status }
        if (startDate && endDate) {
            where = {
                ...where, createdAt: {
                    $gte: moment(startDate).startOf("day").format(),
                    $lte: moment(endDate).endOf("day").format(),
                }
            }
        }

        const interviews = await Interview.find(where).populate('caseId', 'name').populate('warrantId', 'warrantNumber').sort([['createdAt', 'desc']])

        res.status(200).json({
            status: 200,
            data: { totalNotYetFollowedUp, totalBeingFollowedUp, totalFollowedUp, interviews }
        })
    } catch (error) {
        next(error)
    }
}

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
    const { caseId, warrantId, schedule, location, interviewer, respondent, advice, follow_up, result } = req.body
    console.log("[CREATE INTERVIEW]", caseId, warrantId, schedule, location, interviewer, respondent, advice, follow_up, result)

    try {
        const newInterview = new Interview({
            caseId, 
            warrantId,
            schedule: moment(schedule).format(),
            location,
            interviewer,
            respondent,
            advice,
            follow_up,
            result,
            status: 0
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
    console.log("[FETCH INTERVIEW DETAIL]", id)

    try {
        //Check whether the interview exist or not
        const interview = await Interview.findById(id).populate({ path: 'caseId', populate: { path: 'satkerId' } }).populate('warrantId')

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
    const { schedule, location, interviewer, respondent, advice, follow_up, result, status } = req.body
    console.log("[UPDATE INTERVIEW]", schedule, location, interviewer, respondent, advice, follow_up, result, status)

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
        if (location) updatedData = { ...updatedData, location }
        if (interviewer) updatedData = { ...updatedData, interviewer }
        if (respondent) updatedData = { ...updatedData, respondent }
        if (advice) updatedData = { ...updatedData, advice }
        if (follow_up) updatedData = { ...updatedData, follow_up }
        if (result) updatedData = { ...updatedData, result }
        if (status) updatedData = { ...updatedData, status }

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
