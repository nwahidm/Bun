import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const interviewSchema = new Schema(
    {
        caseId: { type: mongoose.Types.ObjectId, ref: "Case", required: true },
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        schedule: { type: Date },
        location: { type: String },
        interviewer: {
            name: { type: String },
            occupation: { type: String },
            NIP: { type: String }
        },
        respondent: {
            name: { type: String },
            nation: { type: String },
            IDCardNumber: { type: String },
            gender: { type: String },
            address: { type: String },
            profession: { type: String }
        },
        advice: { type: String },
        follow_up: { type: String },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Interview = InferSchemaType<typeof interviewSchema>
export const Interview = model("Interview", interviewSchema)