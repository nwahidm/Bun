import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const researchSchema = new Schema(
    {
        caseId: { type: mongoose.Types.ObjectId, ref: "Case", required: true },
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        name: { type: String },
        lapinsus: {
            number: { type: String },
            information: { type: String },
            resource: { type: String },
            trend: { type: String },
            city: { type: String },
            date: { type: Date },
            authorName: { type: String },
            authorOccupation: { type: String },
            authorNIP: { type: String }
        },
        advice: { type: String },
        follow_up: { type: String },
        aghtType: { type: Number, required: true, enum: [0, 1, 2, 3] },
        aghtDescription: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Research = InferSchemaType<typeof researchSchema>
export const Research = model("Research", researchSchema)