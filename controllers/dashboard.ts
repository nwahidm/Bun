import { type NextFunction, type Request, type Response } from "express"
import { Research } from "../models/researches"
import { Interview } from "../models/interviews"
import { Interrogation } from "../models/interrogations"
import { Elicitation } from "../models/elicitations"
import moment from "moment"

export const researchCounter = async (req: Request, res: Response, next: NextFunction) => {
    const { year } = req.body
    console.log("[FETCH DASHBOARD RESEARCH]", year)

    try {
        let totalNotYetFollowedUp = []
        let totalBeingFollowedUp = []
        let totalFollowedUp = []
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

        for (let i = 0; i < months.length; i++) {
            if (i == 11) {
                const total0 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 0
                });

                const total1 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 1
                });

                const total2 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            } else {
                const total0 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 0
                });

                const total1 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 1
                });

                const total2 = await Research.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            }
        }

        res.status(200).json({
            status: 200,
            data: {
                totalNotYetFollowedUp,
                totalBeingFollowedUp,
                totalFollowedUp
            }
        })
    } catch (error) {
        next(error)
    }
}

export const interviewCounter = async (req: Request, res: Response, next: NextFunction) => {
    const { year } = req.body
    console.log("[FETCH DASHBOARD INTERVIEW]", year)

    try {
        let totalNotYetFollowedUp = []
        let totalBeingFollowedUp = []
        let totalFollowedUp = []
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

        for (let i = 0; i < months.length; i++) {
            if (i == 11) {
                const total0 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 0
                });

                const total1 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 1
                });

                const total2 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            } else {
                const total0 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 0
                });

                const total1 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 1
                });

                const total2 = await Interview.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            }
        }

        res.status(200).json({
            status: 200,
            data: {
                totalNotYetFollowedUp,
                totalBeingFollowedUp,
                totalFollowedUp
            }
        })
    } catch (error) {
        next(error)
    }
}

export const interrogationCounter = async (req: Request, res: Response, next: NextFunction) => {
    const { year } = req.body
    console.log("[FETCH DASHBOARD INTERROGATION]", year)

    try {
        let totalNotYetFollowedUp = []
        let totalBeingFollowedUp = []
        let totalFollowedUp = []
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

        for (let i = 0; i < months.length; i++) {
            if (i == 11) {
                const total0 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 0
                });

                const total1 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 1
                });

                const total2 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            } else {
                const total0 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 0
                });

                const total1 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 1
                });

                const total2 = await Interrogation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            }
        }

        res.status(200).json({
            status: 200,
            data: {
                totalNotYetFollowedUp,
                totalBeingFollowedUp,
                totalFollowedUp
            }
        })
    } catch (error) {
        next(error)
    }
}

export const elicitationCounter = async (req: Request, res: Response, next: NextFunction) => {
    const { year } = req.body
    console.log("[FETCH DASHBOARD ELICITATION]", year)

    try {
        let totalNotYetFollowedUp = []
        let totalBeingFollowedUp = []
        let totalFollowedUp = []
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

        for (let i = 0; i < months.length; i++) {
            if (i == 11) {
                const total0 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 0
                });

                const total1 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 1
                });

                const total2 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${+year + 1}-01-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            } else {
                const total0 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 0
                });

                const total1 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 1
                });

                const total2 = await Elicitation.countDocuments({
                    createdAt: {
                        $gte: moment(`${year}-${months[i]}-01`).format(),
                        $lt: moment(`${year}-${months[i + 1]}-01`).format()
                    },
                    status: 2
                });

                totalNotYetFollowedUp.push(total0)
                totalBeingFollowedUp.push(total1)
                totalFollowedUp.push(total2)
            }
        }

        res.status(200).json({
            status: 200,
            data: {
                totalNotYetFollowedUp,
                totalBeingFollowedUp,
                totalFollowedUp
            }
        })
    } catch (error) {
        next(error)
    }
}
