const {Router} = require('express');
const facilitatorsRouter = Router();

const {getFacilitators, createFacilitator, getFacilitatorById, search, updateFacilitator, deleteFacilitator} = require('../controllers/facilitators');

facilitatorsRouter.get('/', getFacilitators);
facilitatorsRouter.post('/', createFacilitator);
facilitatorsRouter.get('/:id', getFacilitatorById);
facilitatorsRouter.post('/search', search);
facilitatorsRouter.patch('/:id/update', updateFacilitator);
facilitatorsRouter.get('/:id/delete', deleteFacilitator);



module.exports = facilitatorsRouter;
