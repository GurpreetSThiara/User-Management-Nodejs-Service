import express from 'express';
import { addRecordToModel, getModelRecords } from '../controllers/crudModelRecordsController';

const router = express.Router();

router.post('/', addRecordToModel)

router.get('/:name',getModelRecords)

export default router;