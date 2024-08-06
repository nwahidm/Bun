import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const caseSchema = new Schema(
    {
        name: { type: String },
        description: { type: String },
        date: { type: Date },
        satkerId: { type: mongoose.Types.ObjectId, ref: "Satker", required: true },
        caseType: { type: Number },
        status: { type: Number, required: true, enum: [0, 1] }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Case = InferSchemaType<typeof caseSchema>
export const Case = model("Case", caseSchema)