const { Router } = require('express');
const { createDeliverable, getDeliverableById, getAllDeliverables, updateDeliverable, deleteDeliverable, getAllDeliverablesInProject } = require('../controllers/deliverables'); 

const router = Router();


router.post('/:uuid/:phaseId', createDeliverable);
router.get('/:uuid/:phaseId', getAllDeliverables); 
router.get('/:uuid', getAllDeliverablesInProject)
router.get('/:uuid/:phaseId/:deliverableId', getDeliverableById);
router.put('/:uuid/:phaseId/:deliverableId', updateDeliverable); 
router.delete('/:uuid/:phaseId/:deliverableId', deleteDeliverable); 

module.exports = router;