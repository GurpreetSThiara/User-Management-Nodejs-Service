import { Schema } from 'mongoose';
import { IField } from '../models/modelDefination';

/**
 * Creates a Mongoose schema based on provided fields with properties like type, required, default, unique, and ref.
 * @param fields A Map where keys are field names and values are objects containing properties like type, required, etc.
 * @returns A Mongoose Schema.
 */
export const createSchemaFromFields = (fields: Map<string, IField>) :Schema=> {
  const schemaDefinition: { [key: string]: any } = {};

  // Iterate over the fields map and construct the schema definition
  fields.forEach((field, fieldName) => {
    const fieldDef: any = {
      type: getType(field.type),  // Function to map field.type to actual Mongoose types
      required: field.required || false,
      unique: field.unique || false,
      default: field.default,
    };

    if (field.enum) {
      fieldDef.enum = field.enum;
    }

    if (field.ref) {
      fieldDef.ref = field.ref;
    }

    // Add this field definition to the schemaDefinition object
    schemaDefinition[fieldName] = fieldDef;
  });

  // Return a new Mongoose schema with the constructed schemaDefinition
  return new Schema(schemaDefinition, { timestamps: true });
};

/**
 * Helper function to map string types to Mongoose types.
 * @param type The string representation of the type (e.g., 'String', 'Number').
 * @returns The corresponding Mongoose type.
 */
const getType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'boolean':
      return Boolean;
    case 'date':
      return Date;
    case 'objectid':
      return Schema.Types.ObjectId;
    case 'mixed':
      return Schema.Types.Mixed;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};
