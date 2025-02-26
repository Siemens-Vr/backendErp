const {Router} = require('express')
const {getLevels, createLevel, getLevelById, updateLevel ,getLevelDataById, getHours,addHours} = require('../controllers/level')

levelsRouter = Router()

levelsRouter.get('/', getLevels)
levelsRouter.post('/', createLevel)
levelsRouter.get('/:uuid', getLevelById)
levelsRouter.patch('/:uuid', updateLevel)
levelsRouter.post('/:levelUUID/facilitators/:id/hours', addHours);
levelsRouter.get('/:id/hours', getHours);
levelsRouter.get('/:cohortId/levels/:levelId', getLevelDataById);

// levelsRouter.delete('/:id', deleteLevel)

module.exports = levelsRouter;
