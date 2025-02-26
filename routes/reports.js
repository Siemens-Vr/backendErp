const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');
const {createReports,getReports, getRecordById, updateReport, deleteProcurement} = require('../controllers/report')


const reportRouter = Router()

reportRouter.get('/:projectId', getReports)
reportRouter.post('/:projectId', upload, createReports)
reportRouter.get('/project/:id',  getRecordById)
reportRouter.get('/:id/update', upload, updateReport)
reportRouter.get('/:id/delete', deleteProcurement)


module.exports = reportRouter