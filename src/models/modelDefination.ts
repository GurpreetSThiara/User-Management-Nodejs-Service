import mongoose, { Schema, Document } from 'mongoose';

export interface IModelDefinition extends Document {
  name: string;
  fields: Map<string, string>;  // Ensure Map is correctly typed
  relationships: Map<string, string>;
}

const modelDefinitionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  fields: { type: Map, of: String },
  relationships: { type: Map, of: String }
});

export default mongoose.model<IModelDefinition>('ModelDefinition', modelDefinitionSchema);
