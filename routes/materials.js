const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/fileUploadMiddleware');
const { createMaterialWithFiles,getAllMaterials,getMaterialById,updateMaterial,deleteMaterial } = require('../controllers/materialController');

// Route to create material with or without files, optionally linked to a week
router.post('/:weekuuid', upload, createMaterialWithFiles);
router.get('/:weekuuid',  getAllMaterials);
router.get('/:weekuuid/:uuid',  getMaterialById);
router.put('/:weekuuid/:uuid',  upload,updateMaterial );
router.delete('/:weekuuid/:uuid', deleteMaterial );

module.exports = router;