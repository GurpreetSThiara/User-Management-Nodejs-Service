// utils/loadModels.ts
import mongoose from 'mongoose';
import ModelDefinition, { IModelDefinition } from '../models/modelDefination';
import { createSchemaFromFields } from './schemaUtils';

/**
 * Loads all model definitions and registers them with Mongoose.
 */
export const loadAllModels = async () => {
  try {
    const modelDefinitions: IModelDefinition[] = await ModelDefinition.find();

    for (const modelDef of modelDefinitions) {
      const modelName = modelDef.name;

      // Check if the model already exists to prevent duplication
      if (!mongoose.models[modelName]) {
        
        const schema = createSchemaFromFields(modelDef.fields);
        mongoose.model(modelName, schema, modelName.toLowerCase()); // Explicitly set collection name
        console.log(`Model created: ${modelName}`);
      } else {
        console.log(`Model already exists: ${modelName}`);
      }
    }

    console.log('All dynamic models loaded successfully.');
  } catch (error) {
    console.log('Error loading dynamic models:', error);
  }
};
