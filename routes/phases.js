const { Router } = require('express');
const { createPhase, getPhaseById, getAllPhases, updatePhase, deletePhase } = require('../controllers/phases'); 

const router = Router();

router.post('/:uuid', createPhase);           
router.get('/:uuid', getAllPhases);           
router.get('/:uuid/:phaseId', getPhaseById);  
router.put('/:uuid', updatePhase);   
router.delete('/:uuid', deletePhase); 

module.exports = router;
