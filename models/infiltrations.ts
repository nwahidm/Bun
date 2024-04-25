import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const infiltrationSchema = new Schema(
    {
        tailingId: { type: mongoose.Types.ObjectId, ref: "Tailing", required: true },
        name: { type: String },
        operationInformation: { type: String },
        plan: [
            {
                activity: String,
                start: String,
                end: String,
                done: Boolean
            }
        ],
        targetDynamic: { type: String },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Infiltration = InferSchemaType<typeof infiltrationSchema>
export const Infiltration = model("Infiltration", infiltrationSchema)