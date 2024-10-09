// utils/createSchema.ts
import { Schema } from 'mongoose';

/**
 * Creates a Mongoose schema based on provided fields.
 * @param fields A Map where key is field name and value is field type.
 * @returns A Mongoose Schema.
 */
export const createSchemaFromFields = (fields: Map<string, string>): Schema => {
  const schemaDefinition: { [key: string]: any } = {};

  fields.forEach((type, fieldName) => {
    switch (type.toLowerCase()) {
      case 'string':
        schemaDefinition[fieldName] = { type: String };
        break;
      case 'number':
        schemaDefinition[fieldName] = { type: Number };
        break;
      case 'boolean':
        schemaDefinition[fieldName] = { type: Boolean };
        break;
      case 'date':
        schemaDefinition[fieldName] = { type: Date };
        break;
      case 'objectid':
        schemaDefinition[fieldName] = { type: Schema.Types.ObjectId };
        break;
      // Add more types as needed
      default:
        schemaDefinition[fieldName] = { type: Schema.Types.Mixed };
    }
  });

  return new Schema(schemaDefinition, { timestamps: true }); // Adding timestamps as an example
};
