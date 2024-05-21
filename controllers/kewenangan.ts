import { type NextFunction, type Request, type Response } from "express"
import { Kewenangan } from "../models/kewenangan"

export const fetchAllKewenangan = async (req : Request, res: Response, next: NextFunction) => {
    console.log("[FETCH ALL KEWENANGAN]")
    
    try {
        const kewenangans = await Kewenangan.find()

        res.status(200).json({
            status: 200,
            data: kewenangans
        })
    } catch (error) {
        next(error)
    }
}

export const createKewenangan = async (req: Request, res: Response, next: NextFunction) => {
    const { deskripsi } = req.body
    console.log("[CREATE KEWENANGAN]", deskripsi)

    try {
        //Check whether kewenangan already exists or not
        const checkKewenangan = await Kewenangan.findOne({deskripsi})

        if (checkKewenangan) {
            throw {
                name: "Already Exist",
                message: `Kewenangan ${deskripsi} sudah ada`
            }
        }

        const newKewenangan = new Kewenangan({
            deskripsi
        })

        await newKewenangan.save()

        res.status(201).json({
            status: 201,
            message: "Kewenangan berhasil dibuat"
        })
    } catch (error) {
        next(error)
    }
}