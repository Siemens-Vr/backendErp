const { Categories } = require('../models');
const validateCategory = require('../validation/categoriesValidation'); 
const Joi = require('joi');
// Validation schema for UUID
const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required();

module.exports.getCategories = async (req, res)=>{
      
    try{
        const categories = await Categories.findAll()

        if(!categories){
            res.status(404).json("No categories found")
        }
        res.status(200).json(categories)

    }catch(error){
        res.status(500).json({message  :error.message})
    }

}
module.exports.getCategoryById = async (req, res) => {
    // Validate the UUID from the request parameters
    const { error: uuidError, value: uuid } = uuidSchema.validate(req.params.id);
  
    if (uuidError) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
  
    try {
      // Find the category by UUID
      const category = await Categories.findOne({ where: { uuid: uuid } });
  
      // If the category is not found, return a 404 response
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Return the found category
      res.status(200).json({ message: "Category retrieved successfully", category });
  
    } catch (error) {
      // Handle any unexpected errors
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.createCategories = async (req, res) => {
    const { category } = req.body;
  
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
  
    const categoriesArray = category.split(',').map(cat => cat.trim());
  
    // Validate each category
    const validationErrors = [];
    categoriesArray.forEach((cat, index) => {
      const { error } = validateCategory({ category: cat });
      if (error) {
        validationErrors.push(`Category at index ${index}: ${error.details[0].message}`);
      }
    });
  
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors: validationErrors });
    }
  
    try {
      const newCats = await Categories.bulkCreate(
        categoriesArray.map(cat => ({ category: cat })),
        { ignoreDuplicates: true } 
      );
  
      if (!newCats.length) {
        return res.status(400).json({ message: "Could not create new categories" });
      }
  
      res.status(200).json({ message: "Categories created successfully", categories: newCats });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.updateCategory = async (req, res) => {
    const { error: uuidError, value: uuid } = uuidSchema.validate(req.params.id);
  
    if (uuidError) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
  
    const { error, value } = validateCategory(req.body);
  
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.context.key,
          message: detail.message
        }))
      });
    }
  
    try {
      const [updatedRows] = await Categories.update(value, {
        where: { uuid: uuid }
      });
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      const updatedCategory = await Categories.findOne({ where: { uuid: uuid } });
      res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports.deleteCategory = async (req, res) => {
    const { error: uuidError, value: uuid } = uuidSchema.validate(req.params.id);
  
    if (uuidError) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
  
    try {
      const deletedRows = await Categories.destroy({
        where: { uuid: uuid }
      });
  
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(200).json({ message: "Category deleted successfully" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };