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
    ObjectId:mongoose.Types.ObjectId
  };
export const getModels = async (req: Request, res: Response) => {
  try {
    const modelDefinitions:any = await ModelDefinition.find();
    // console.log(modelDefinitions)
    // const modelData = modelDefinitions.map((def: any) => ({
    //   name: def.name,
    //   fields: def.feilds,
    //   relationships: def.relationships
    // }));
    res.json(modelDefinitions);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createModel = async (req: Request | any, res: Response) => {
  try {
    const userId= req.userId;
    const { name } = req.body;

    const existingModel = await ModelDefinition.findOne({ name });
    if (existingModel) {
      return res.status(400).json({ message: 'Model already exists' });
    }

    const baseModelName = name;
    const modelName = `${baseModelName}__Dyn`; // Append '__Dyn' suffix
    const newModelDefinition = new ModelDefinition({ name:modelName, fields: {
      status:{
        type:"String",
        enum:["active","inactive"]
      },
      visibility:{
        type:"String",
        enum:["public","privare"]
      },
      required:{
        type:"Boolean",
        default:false
      },

     


    }, relationships: {
      
      
    } });
    await newModelDefinition.save();


    const schema = createSchemaFromFields(newModelDefinition.fields)
    mongoose.model(modelName, schema, modelName.toLowerCase());
    models[name] = createDynamicModel(name);
    res.status(200).json({ message: 'Model created successfully' });
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addField = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { modelName } = req.params;
    const metadata = req.body;
    console.log(req.body);

    if (!metadata) {
      return res.status(400).json({ message: 'Field name and type are required' });
    }

    if (!mongooseTypeMap[metadata.type]) {
      console.log("invalid feild type")
      return res.status(400).json({ message: 'Invalid field type' });
    }

    // If the field type is ObjectId and ref is provided, ensure ref is a string (model name)
    if (metadata.type === 'ObjectId') {
      if (!metadata.ref || typeof metadata.ref !== 'string') {
        console.log("A valid ref (model name) is required for ObjectId type")

        return res.status(400).json({ message: 'A valid ref (model name) is required for ObjectId type' });
      }

      // Optionally, verify that the referenced model exists
      if (!mongoose.modelNames().includes(metadata.ref)) {
        console.log(`Referenced model "${metadata.ref}" does not exist`)
        return res.status(400).json({ message: `Referenced model "${metadata.ref}" does not exist` });
      }
    }

    
    // Find the model definition within the session
    const modelDefinition = await ModelDefinition.findOne({ name: modelName }).session(session);
    if (!modelDefinition) {
      console.log("404")
      return res.status(404).json({ message: 'Model not found' });
    }

    // Check if the field already exists
    if (modelDefinition.fields.has(metadata.name)) {
      return res.status(400).json({ message: `Field "${metadata.name}" already exists in model "${modelName}"` });
    }

    // Add the new field to the model definition
    modelDefinition.fields.set(metadata.name, metadata);
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

    res.status(200).json({ message: 'Field added successfully' });
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

export const loadModels = (modelDefinitions: Array<IModelDefinition>): void => {
  modelDefinitions.forEach(({ name, fields, relationships }) => {
    // Create a schema based on the fields provided
    const schemaDefinition: Record<string, any> = {
      name: { type: String, required: true, unique: true },
      ...fields,
      relationships: { type: Object, required: true } // Use Object to hold relationships
    };

    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });

    // Register the model with Mongoose
    mongoose.model<IModelDefinition>(name, schema);
  });
};

// export const loadModels = async () => {
//   try {
//     const modelDefinitions = await ModelDefinition.find();
//     for (const def of modelDefinitions) {
//       models[def.name] = createDynamicModel(def.name);
      
//       for (const [fieldName, fieldType] of Object.entries(def.fields)) {
//         (models[def.name].schema as Schema).add({ [`fields.${fieldName}`]: fieldType });
//       }
//       for (const [relationName, relatedModel] of Object.entries(def.relationships)) {
//         (models[def.name].schema as Schema).add({
//           [`relationships.${relationName}`]: [{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: relatedModel
//           }]
//         });
//       }
//     }
//     console.log('Models loaded successfully');
//   } catch (error) {
//     console.error('Error loading models:', error);
//   }
// };