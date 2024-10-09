import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';

import ModelDefinition, { IModelDefinition } from '../models/modelDefination';
import { createDynamicModel } from '../models/BaseModel';
import { createSchemaFromFields } from '../utils/schemaUtils';

const models: { [key: string]: mongoose.Model<any> } = {};
const mongooseTypeMap: { [key: string]: any } = {
    String: String,
    Number: Number,
    Date: Date,
    Boolean: Boolean,
    Buffer: Buffer,
  };
export const getModels = async (req: Request, res: Response) => {
  try {
    const modelDefinitions:any = await ModelDefinition.find();
    const modelData = modelDefinitions.map((def: { name: any; fields: Iterable<readonly [PropertyKey, any]>; relationships: Iterable<readonly [PropertyKey, any]>; }) => ({
      name: def.name,
      fields: Object.fromEntries(def.fields),
      relationships: Object.fromEntries(def.relationships)
    }));
    res.json(modelData);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createModel = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingModel = await ModelDefinition.findOne({ name });
    if (existingModel) {
      return res.status(400).json({ message: 'Model already exists' });
    }

    const baseModelName = name;
    const modelName = `${baseModelName}__Dyn`; // Append '__Dyn' suffix
    const newModelDefinition = new ModelDefinition({ name:modelName, fields: {}, relationships: {} });
    await newModelDefinition.save();

    const schema = createSchemaFromFields(newModelDefinition.fields)
    mongoose.model(modelName, schema, modelName.toLowerCase()); // Explicitly set collection name
  //  models[name] = createDynamicModel(name);
    res.status(201).json({ message: 'Model created successfully' });
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addField = async (req: Request, res: Response) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin transaction
  
    try {
      const { modelName } = req.params;
      const { name, type }: { name: string; type: string } = req.body;
  
      if (!name || !type) {
        return res.status(400).json({ message: 'Field name and type are required' });
      }
  
      if (!mongooseTypeMap[type]) {
        return res.status(400).json({ message: 'Invalid field type' });
      }
  
      // Find the model definition within the session
      const modelDefinition = await ModelDefinition.findOne({ name: modelName }).session(session);
      if (!modelDefinition) {
        return res.status(404).json({ message: 'Model not found' });
      }
  
      // Check if the field already exists
      if (modelDefinition.fields.has(name)) {
        return res.status(400).json({ message: `Field "${name}" already exists in model "${modelName}"` });
      }
  
      // Add the new field to the model definition
      modelDefinition.fields.set(name, type);
      await modelDefinition.save({ session }); // Save changes to ModelDefinition
  
      // Update the dynamic model's schema
      const DynamicModel = mongoose.models[`${modelName}`]; // Access the dynamic model
      if (!DynamicModel) {
        throw new Error('Dynamic model does not exist');
      }
  
      // Create a new schema from updated fields
      const newSchema = createSchemaFromFields(modelDefinition.fields);
      DynamicModel.schema = newSchema; // Update the existing dynamic model's schema
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession(); // End the session
  
      res.json({ message: 'Field added successfully' });
    } catch (error) {
      await session.abortTransaction(); // Rollback the transaction on error
      session.endSession(); // End the session
      console.error('Error adding field:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const addRelationship = async (req: Request, res: Response) => {
  try {
    const { modelName } = req.params;
    const { name, model: relatedModel } = req.body;
    const modelDefinition = await ModelDefinition.findOne({ name: modelName });
    const relatedModelDefinition = await ModelDefinition.findOne({ name: relatedModel });
    if (!modelDefinition || !relatedModelDefinition) {
      return res.status(404).json({ message: 'Model not found' });
    }
   // modelDefinition.relationships[name] = relatedModel;
    await modelDefinition.save();
    if (!models[modelName]) {
      models[modelName] = createDynamicModel(modelName);
    }
    (models[modelName].schema as Schema).add({
      [`relationships.${name}`]: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: relatedModel
      }]
    });
    res.json({ message: 'Relationship added successfully' });
  } catch (error) {
    console.error('Error adding relationship:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loadModels = async () => {
  try {
    const modelDefinitions = await ModelDefinition.find();
    for (const def of modelDefinitions) {
      models[def.name] = createDynamicModel(def.name);
      
      for (const [fieldName, fieldType] of Object.entries(def.fields)) {
        (models[def.name].schema as Schema).add({ [`fields.${fieldName}`]: fieldType });
      }
      for (const [relationName, relatedModel] of Object.entries(def.relationships)) {
        (models[def.name].schema as Schema).add({
          [`relationships.${relationName}`]: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: relatedModel
          }]
        });
      }
    }
    console.log('Models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error);
  }
};