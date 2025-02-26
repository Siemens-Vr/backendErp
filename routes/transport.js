const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');
const {createTransport, getTransports,getTransportById,search,updateTransport,deleteTransport} = require('../controllers/transport')


const transportRouter = Router()

transportRouter.get('/:projectId', getTransports)
transportRouter.post('/:projectId', upload, createTransport)
transportRouter.get('/project/:id', getTransportById)
transportRouter.post('/search', search)
transportRouter.patch('/:id/update', upload, updateTransport)   
transportRouter.get('/:id/delete', deleteTransport) 


module.exports = transportRouter