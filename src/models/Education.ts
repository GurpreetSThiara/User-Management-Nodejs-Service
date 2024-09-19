import mongoose , {Document , Schema} from "mongoose";

export interface Education extends Document {
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
}

const EducationSchemma  : Schema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field_of_study: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
},{
    timestamps:true
})

export default mongoose.model<Education>('Experience',EducationSchemma);