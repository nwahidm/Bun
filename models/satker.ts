import { Schema, type InferSchemaType, model } from "mongoose"

const satkerSchema = new Schema(
    {
        code: { type: String },
        name: { type: String, required: true },
        address: { type: String },
        phoneNumber: { type: String }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Satker = InferSchemaType<typeof satkerSchema>
export const Satker = model("Satker", satkerSchema)