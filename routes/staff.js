const {Router} = require('express')
const {getStaff, createStaff, getStaffById, updateStaff, deleteStaff, addLeaveDays} = require('../controllers/staff')

const staffRouter = Router()

staffRouter.get('/', getStaff)
staffRouter.post('/', createStaff)
staffRouter.get('/:id', getStaffById)
staffRouter.patch('/:id/update', updateStaff);
staffRouter.post('/:id/leave', addLeaveDays);
staffRouter.get('/:id/delete', deleteStaff);



module.exports = staffRouter;
