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

export type Kewengangan = InferSchemaType<typeof kewenanganSchema>
export const Kewengangan = model("Kewenangan", kewenanganSchema)