const express = require('express');
const {createWeek,getAllWeeks,getWeekById,updateWeek,deleteWeek} = require('../controllers/weeksController');
const router = express.Router();


router.post('/:facilitatorId/:levelId', createWeek);
router.get('/:levelId', getAllWeeks);
router.get('/:levelId/:uuid', getWeekById);
router.put('/:facilitatorId/:levelId/:uuid', updateWeek);
router.delete('/:facilitatorId/:levelId/:uuid', deleteWeek);

module.exports = router;
