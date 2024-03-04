import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const interviewSchema = new Schema(
    {
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        schedule: { type: Date },
        advice: { type: String },
        follow_up: { type: String },
        result: { type: String }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Interview = InferSchemaType<typeof interviewSchema>
export const Interview = model("Interview", interviewSchema)