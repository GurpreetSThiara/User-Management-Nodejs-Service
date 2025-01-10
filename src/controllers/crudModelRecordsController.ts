
import { Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import { FailedResponse, SuccessResponse } from '../utils/responseUtils';
import modelDefination from '../models/modelDefination';


const getModelByName = async (name: string) => {
    try {
        const model = await modelDefination.findOne({ name });
        return model;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching model');
    }
};


// const validateRecord = async (data: any) => {
//     try {
//         const { meta, record } = data;
//         const model = await getModelByName(meta.name);

  
//         if (!model) {
//             throw new Error('Model definition not found');
//         }

//         const fields = model.fields;

  
//         for (const field of fields.keys()) {
//             if (!record.hasOwnProperty(field)) {
//                 throw new Error(`Missing field: ${field}`);
//             }


//             const fieldType = fields.get(field.type);
//             if (typeof record[field] !== fieldType?.toLowerCase()) {
//                 throw new Error(`Field type mismatch for ${field}`);
//             }
//         }

//         return true;
//     } catch (error) {
//         console.log(error);
//         throw new Error('Validation failed');
//     }
// };



export const addRecordToModel = async (req: Request, res: Response) => {
    try {
        const { meta, record } = req.body;

        console.log(record)


        const modelDefinition = await getModelByName(meta.name);

        if (!modelDefinition) {
            return res.status(404).json({ message: 'Model definition not found.' });
        }

  
        console.log(mongoose.models)
        const existingModel = mongoose.models[modelDefinition.name];
        if (!existingModel) {
            return res.status(404).json({ message: `Dynamic model "${modelDefinition.name.toLowerCase() +"s"}" not found.` });
        }

   
        const fields = modelDefinition.fields;

   
        // for (const field of fields.keys()) {
        //     if (!record.hasOwnProperty(field) && ) {
        //         return res.status(400).json({ message: `Missing field: ${field}` });
        //     }

     
        //     const fieldType = fields.get(field);
        //     // if (typeof record[field] !== fieldType?.toLowerCase()) {
        //     //     return res.status(400).json({ message: `Field type mismatch for ${field}` });
        //     // }
        // }

     
        const newRecord = new existingModel(record);
        console.log(record)
        await newRecord.save();

        SuccessResponse(res, 'Record added successfully', newRecord);
    } catch (error) {
        console.error('Error adding record:', error);
        FailedResponse(res, 'An error occurred while adding the record', 500);
    }
};


export const getModelRecords = async (req: Request, res: Response) => {
    try {
        const modelName = req.params.name;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const modelDefinition = await getModelByName(modelName);
        if (!modelDefinition) {
            return res.status(404).json({ message: 'Model definition not found.' });
        }

        const existingModel = mongoose.models[modelDefinition.name];
        if (!existingModel) {
            return res.status(404).json({ message: `Dynamic model "${modelDefinition.name.toLowerCase() + "s"}" not found.` });
        }

        const records = await existingModel.find().skip(skip).limit(limit);
        const totalRecords = await existingModel.countDocuments();

        const response = {
            success: true,
            data: records,
            pagination: {
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
                currentPage: page,
                limit,
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching records:', error);
        FailedResponse(res, 'An error occurred while fetching records', 500);
    }
};