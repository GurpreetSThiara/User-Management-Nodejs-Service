import mongoose , {Document , Schema} from "mongoose";

export interface ConnectionRequest extends Document{
    user_id: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: Date;
    updated_at: Date;
}

const ConnectionRequestSchema: Schema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },

}, {

    timestamps: true
})

export default mongoose.model<ConnectionRequest>('ConnectionRequest',ConnectionRequestSchema);