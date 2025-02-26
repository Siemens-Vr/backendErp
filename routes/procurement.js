const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');


const { 
  getProcurements, 
  createProcurement, 
  getProcurementById, 
  search, 
  updateProcurement, 
  deleteProcurement 
} = require('../controllers/procurement');

const procurementRouter = Router();

procurementRouter.get('/:projectId', getProcurements);
procurementRouter.post('/:projectId', upload, createProcurement);
procurementRouter.get('/:projectId/:id', getProcurementById);
procurementRouter.post('/search', search);
procurementRouter.patch('/:id/update',upload, updateProcurement);
procurementRouter.get('/:id/delete', deleteProcurement);

module.exports = procurementRouter;

