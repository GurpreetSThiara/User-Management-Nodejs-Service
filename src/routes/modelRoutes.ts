import express from 'express';
import { getModels, createModel, addField, addRelationship } from '../controllers/adminModelController';

const router = express.Router();

router.get('/', getModels);
router.post('/', createModel);
router.post('/:modelName/fields', addField);
// router.post('/:modelName/relationships', addRelationship);


export default router;