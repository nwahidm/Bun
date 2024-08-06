import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const warrantSchema = new Schema(
    {
        caseId: { type: mongoose.Types.ObjectId, ref: "Case", required: true },
        warrantNumber: { type: String, required: true },
        satkerId: {type: mongoose.Types.ObjectId, ref: "Satker", required: true },
        description: { type: String, required: true },
        document: { type: String, required: true },
        warrantType: { type: Number, required: true, enum: [0, 1] }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Warrant = InferSchemaType<typeof warrantSchema>
export const Warrant = model("Warrant", warrantSchema)