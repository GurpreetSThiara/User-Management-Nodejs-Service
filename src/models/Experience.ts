import mongoose , {Document , Schema} from "mongoose";

export interface Experience extends Document {
    job_title: string;
    company: string;
    start_date: Date;
    end_date: Date;
    description: string;
    created_at: Date;
    updated_at: Date;
}

const ExperienceSchemma  : Schema = new mongoose.Schema({
    job_title: { type: String, required: true },
    company: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    description: String,
},{
    timestamps:true
})

export default mongoose.model<Experience>('Experience',ExperienceSchemma);