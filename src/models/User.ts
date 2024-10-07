import mongoose, { Document, Schema } from 'mongoose';
import { ConnectionRequest } from './ConnectionRequest';


type UserRole = 'ADMIN' | 'USER' | 'GUEST';


type Status = 'ACTIVE' | 'INACTIVE'


const roles: Record<UserRole, { permissions: string[] }> = {
  ADMIN: {
    permissions: ['create', 'read', 'update', 'delete'],
  },
  USER: {
    permissions: ['read', 'update'],
  },
  GUEST: {
    permissions: ['read'],
  },
};

export interface IUser extends Document {
  role: UserRole;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  status:Status,
  profile_image?: string;
  headline?: string;
  lastLogin:Date;
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
    role: {
      type: String,
      enum: Object.keys(roles) as UserRole[], // Ensure type safety here
      default: 'USER', // Set a default role
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true , required:true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String },
    headline: { type: String },
    lastLogin:{type:Date},
    summary: { type: String },
    status:{type: String, default:'ACTIVE'},
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
  }
);

// Add a method to get permissions based on the user role
userSchema.methods.getPermissions = function (): string[] {
  return roles[this.role as UserRole].permissions;
};

export default mongoose.model<IUser>('User', userSchema);
