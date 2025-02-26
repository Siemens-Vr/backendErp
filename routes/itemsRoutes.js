// routes/itemsRoutes.js


const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.getItems);
router.post('/', itemsController.createItem);
router.get('/:id', itemsController.getItemById);
router.put('/update/:id', itemsController.updateItem);
router.delete('/delete/:id', itemsController.deleteItem);

module.exports = router;
