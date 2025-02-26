const { Router } = require('express');
const { createAssignee, getAssigneeById, getAllAssignees, updateAssignee, deleteAssignee } = require('../controllers/assignees'); 

const router = Router();


router.post('/:uuid', createAssignee);
router.get('/:uuid', getAllAssignees);
router.get('/:uuid/:assigneeId', getAssigneeById);
router.put('/:uuid/:assigneeId', updateAssignee);
router.delete('/:uuid/:assigneeId', deleteAssignee); 

module.exports = router;
