import mongoose, { Schema, Document } from 'mongoose';


export interface IField {

  type: string;
  default?: any;
  required?: boolean;
  unique?: boolean;
  enum?: any[];
  ref?: mongoose.Types.ObjectId;

}



export interface IModelDefinition extends Document {
  name: string;
  fields: Map<string, IField>;
  relationships: Record<string, string>;
}


const fieldSchema = new Schema<IField>({
  
  type: { type: String, required: true },
  default: Schema.Types.Mixed,
  required: { type: Boolean, default: false },
  unique: { type: Boolean, default: false },
  enum: { type: [Schema.Types.Mixed], default: undefined },
  ref: { type: String, ref: 'OtherModel' }
}, { _id: false , timestamps:true});


const modelDefinitionSchema = new Schema<IModelDefinition>({
  
  name: { type: String, required: true, unique: true },
  fields: {
    type: Map,
    of: fieldSchema,
    required: true
  },
  relationships: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});


export default mongoose.model<IModelDefinition>('ModelDefinition', modelDefinitionSchema);
