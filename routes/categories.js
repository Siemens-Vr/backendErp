const {getCategories, createCategories} =   require('../controllers/categories')
const {Router} = require('express')

categoriesRouter = Router()

categoriesRouter.get('/', getCategories)
categoriesRouter.post('/', createCategories)

module.exports = categoriesRouter;
