import mongoose, { Document, Schema } from 'mongoose';
import { ConnectionRequest } from './ConnectionRequest';

export interface IUser extends Document {
  
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_image?: string;
  headline?: string;
  summary?: string;
  experience: Array<mongoose.Schema.Types.ObjectId>;
  education: Array<mongoose.Schema.Types.ObjectId>;
  skills: string[];
  location?: string;
  connections: mongoose.Types.ObjectId[];
  connection_requests: Array<mongoose.Schema.Types.ObjectId>;
  settings: {
    visibility: 'public' | 'private' | 'connections-only';
    notifications: {
      email_notifications: boolean;
      sms_notifications: boolean;
    };
  };
  created_at: Date;
  updated_at: Date;
}

const userSchema: Schema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String },
    headline: { type: String },
    summary: { type: String },
    experience: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },

    ],
    education: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Education' },

    ],
    skills: [String],
    location: { type: String },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    connection_requests: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest' },
    ],
    settings: {
      visibility: {
        type: String,
        enum: ['public', 'private', 'connections-only'],
        default: 'public',
      },
      notifications: {
        email_notifications: { type: Boolean, default: true },
        sms_notifications: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true, 
  })

export default mongoose.model<IUser>('User', userSchema);
