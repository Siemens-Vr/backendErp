const {Router } = require('express');
const {getCohorts, createCohort, getCohortById,deleteCohort, updateCohort} = require('../controllers/cohort')

const cohortRouter = Router();



cohortRouter.get('/', getCohorts)
cohortRouter.post('/', createCohort)
cohortRouter.get('/:id', getCohortById)
cohortRouter.patch('/:id/update', updateCohort)
cohortRouter.get('/:id/delete', deleteCohort)





module.exports = cohortRouter