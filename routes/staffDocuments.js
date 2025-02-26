const express = require('express');
const router = express.Router();
const {createDocument,updateDocument,getAllDocuments,getDocumentById,deleteDocument} = require('../controllers/staffController');
const upload = require('../middleware/uploadStaffMiddleware');



router.post('/:uuid', upload.single('file'), createDocument);
router.put('/:uuid/:documentUuid', upload.single('file'), updateDocument);
router.get('/:uuid', getAllDocuments);
router.get('/:uuid/:documentUuid',getDocumentById);
router.delete('/:uuid/:documentUuid', deleteDocument);


module.exports = router;
