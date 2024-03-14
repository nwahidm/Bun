import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const elicitationSchema = new Schema(
    {
        interviewId: { type: mongoose.Types.ObjectId, ref: "Interview", required: true },
        name: { type: String },
        record: { type: String },
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

export type Elicitation = InferSchemaType<typeof elicitationSchema>
export const Elicitation = model("Elicitation", elicitationSchema)