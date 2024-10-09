import mongoose, { Schema, Document } from 'mongoose';

export interface IBaseModel extends Document {
  [key: string]: any;
}

const baseSchema = new Schema(
  {
    // This will store our dynamic fields
    fields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    // This will store our dynamic relationships
    relationships: {
      type: Map,
      of: [{
        type: Schema.Types.ObjectId,
        refPath: 'relationships.$*.model'
      }]
    }
  },
  {
    strict: false,
    timestamps: true,
  }
);

// This function will create a new model based on the base schema
export function createDynamicModel(modelName: string): mongoose.Model<IBaseModel> {
  return mongoose.model<IBaseModel>(modelName, baseSchema);
}

export default baseSchema;