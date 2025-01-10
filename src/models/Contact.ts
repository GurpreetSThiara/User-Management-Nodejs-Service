import mongoose , {Document , Schema} from "mongoose";


export interface Contact {
    accountId:string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role:string;
    createdAt:Date;
    updatedAt:Date;
}

const ContactSchema:  Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['admin', 'user', 'guest'] },

},{
    timestamps:true
})
export const ContactModel = mongoose.model<Contact & Document>('Contact', ContactSchema);
