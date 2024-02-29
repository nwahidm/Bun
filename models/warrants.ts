import { Schema, type InferSchemaType, model } from "mongoose"

const warrantSchema = new Schema(
    {
        warrantNumber: { type: String, required: true },
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