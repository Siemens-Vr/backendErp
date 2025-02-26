const {Router } = require('express');
const {getStudents, createStudent, getStudentById, search, updateStudent,addStudentLevel,updateStudentLevel, deleteStudent} = require('../controllers/student')

const studentRouter = Router();

studentRouter.get('/', getStudents)
studentRouter.post('/', createStudent)
studentRouter.post('/addLevel', addStudentLevel)
studentRouter.patch('/:id/updateLevel', updateStudentLevel)
studentRouter.get('/:id', getStudentById)
studentRouter.post('/search', search)
studentRouter.patch('/:id/update', updateStudent)
studentRouter.get('/:id/delete', deleteStudent)


module.exports = studentRouter