import mongoose, { model, Schema } from 'mongoose';


export interface Role {
  name: string;
  description: string;
  permissions: Array<Schema.Types.ObjectId>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
}

const RoleSchema : Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  permissions: [{ type: Schema.Types.ObjectId, required: true , ref: 'Permission'}],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true }
});

export default mongoose.model<Role>('Roles' ,RoleSchema)

