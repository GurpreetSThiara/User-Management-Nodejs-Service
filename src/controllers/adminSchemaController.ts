
import mongoose, { Schema } from 'mongoose';
import { Request, Response } from 'express';
interface FieldInfo {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  ref?: string;
}

interface ModelInfo {
  name: string;
  fields: FieldInfo[];
}
export const getModelSchemas = (): ModelInfo[] => {
    const models: ModelInfo[] = [];
  
    mongoose.models && Object.keys(mongoose.models).forEach((modelName) => {
      const model = mongoose.model(modelName);
      const schema: Schema = model.schema;
      const fields: FieldInfo[] = [];
  
      schema.eachPath((path, schemaType) => {
        const field: FieldInfo = {
          name: path,
          type: schemaType.instance,
        };
  
        if (schemaType.isRequired) field.required = true;
        if (schemaType.options.unique) field.unique = true;
        if ((schemaType as any).options.ref) field.ref = (schemaType as any).options.ref;
  
        fields.push(field);
      });
      if(modelName !== 'ModelDefinition')
  
      models.push({
        name: modelName,
        fields,
      });
    });
  
    return models;
  };


  export const getSchemas = async (req: Request, res: Response) => {
    try {
      const models = getModelSchemas();
      res.status(200).json({ "success": true, "data": models });
    } catch (error) {
      console.error('Error fetching model schemas:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }