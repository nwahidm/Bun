import mongoose, { Schema, type InferSchemaType, model } from "mongoose"

const interrogationSchema = new Schema(
    {
        caseId: { type: mongoose.Types.ObjectId, ref: "Case", required: true },
        warrantId: { type: mongoose.Types.ObjectId, ref: "Warrant", required: true },
        name: { type: String },
        date: { type: Date },
        record: { type: String },
        location: { type: String },
        interrogators: [
            {
                name: { type: String },
                occupation: { type: String },
                nip: { type: String }
            }
        ],
        targetIdentification: {
            name: { type: String },
            placeOfBirth: { type: String },
            dateOfBirth: { type: Date },
            nationality: { type: String },
            domicile: { type: String },
            religion: { type: String },
            profession: { type: String },
            education: { type: String },
            phoneNumber: { type: String },
            IDCardNumber: { type: String }
        },
        result: { type: String },
        status: { type: Number }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export type Interrogation = InferSchemaType<typeof interrogationSchema>
export const Interrogation = model("Interrogation", interrogationSchema)