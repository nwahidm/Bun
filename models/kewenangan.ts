import { Schema, type InferSchemaType, model } from "mongoose"

const kewenanganSchema = new Schema(
    {
        deskripsi: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Kewenangan = InferSchemaType<typeof kewenanganSchema>
export const Kewenangan = model("Kewenangan", kewenanganSchema)