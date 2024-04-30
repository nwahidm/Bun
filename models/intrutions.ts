import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const intrutionSchema = new Schema(
    {
        infiltrationId: { type: mongoose.Types.ObjectId, ref: "Infiltration", required: true },
        name: { type: String },
        location: {
            address: { type: String },
            latlong: { type: String }
        },
        environment: { type: String },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Intrution = InferSchemaType<typeof intrutionSchema>
export const Intrution = model("Intrution", intrutionSchema)