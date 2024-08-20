import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const elicitationSchema = new Schema(
    {
        caseId: { type: mongoose.Types.ObjectId, ref: "Case", required: true },
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        name: { type: String },
        record: { type: String },
        advice: { type: String },
        follow_up: { type: String },
        result: {
            number: { type: String },
            introduction: { type: String },
            execution: { type: String },
            constraint: { type: String },
            analysis: { type: String },
            conclusion: { type: String },
            advice: { type: String }
        },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Elicitation = InferSchemaType<typeof elicitationSchema>
export const Elicitation = model("Elicitation", elicitationSchema)