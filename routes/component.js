const { Router } = require('express');
const multer = require('multer');
const componentsRouter = Router();

const {
  getComponents,
  createComponent,
  uploadComponents,
  getComponentById,
  updateComponent,
  updateComponentQuantity,
  deleteComponent,
  getComponentsType,
  getComponentHistory
} = require("../controllers/component");

const upload = multer({ storage: multer.memoryStorage() });

// Define routes
componentsRouter.get('/', getComponentsType);
componentsRouter.post('/', createComponent);
componentsRouter.post('/upload', upload.single('file'), (req, res, next) => {
  console.log('File received:', req.file);
  next();
}, uploadComponents);
componentsRouter.get('/components/:componentsType', getComponents);
componentsRouter.get('/:id', getComponentById);
componentsRouter.patch('/:id/update', updateComponent);
componentsRouter.patch('/:id/update-quantity', updateComponentQuantity);
componentsRouter.delete('/:id', deleteComponent);
componentsRouter.get('/:id/history', getComponentHistory);

module.exports = componentsRouter;
