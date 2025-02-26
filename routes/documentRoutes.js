const express = require('express');
const router = express.Router();
const {
  createDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsInSubfolder,
  getAllDocumentsAndFolders,
  deleteDocument
} = require('../controllers/documents');
const upload = require('../middleware/uploadMiddleware');

// Create document
router.post('/:projectUuid/:folderUuid?/:subFolderUuid?', upload.single('file'), createDocument);
// router.post('/:projectUuid/folders/:folderUuid', upload.single('file'), createDocument);
// router.post('/:projectUuid/folders/:folderUuid/subfolders/:subFolderUuid', upload.single('file'), createDocument);
router.put('/:projectUuid/:documentUuid/:folderUuid?/:subFolderUuid?', upload.single('file'), updateDocument);
router.get('/:projectUuid/folders', getAllDocumentsAndFolders);
router.get('/:projectUuid/:folderUuid?', getAllDocuments);
// router.get('/:projectUuid/:subFolderUuid', getDocumentsInSubfolder);
router.get('/:projectUuid/:folderUuid/:subFolderUuid', getDocumentsInSubfolder);

router.get('/:projectUuid', getAllDocumentsAndFolders);
// router.get('/:projectUuid/folders/:folderUuid/subfolders/:subFolderUuid', getAllDocuments);
// router.get('/:projectUuid/:documentUuid', getDocumentById);
router.delete('/:projectUuid/:documentUuid/:folderUuid?/:subFolderUuid?', deleteDocument);

module.exports = router;