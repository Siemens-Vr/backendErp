const {BorrowedComponent, Component, sequelize} = require('../models')
const validateBorrowedComponent = require('../validation/borrowedcomponentsValidaton');
const Joi = require('joi');

// Validation schema for UUID
const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required();

module.exports.getBorrowers = async (req, res) => {
  try {
    const borrowers = await BorrowedComponent.findAll({
      include: [{
        model: Component,
        as: 'component',
        attributes: ['componentName', 'partNumber', 'componentType',  'status', 'condition']
      }]
    });

    if (!borrowers.length) {
      return res.status(404).json({ message: "No borrowers found" });
    }
    // console.log(borrowers)

    res.status(200).json(borrowers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postBorrowers = async (req, res) => {
    console.log(req.body);

    // Validate the request body
  const { error, value } = validateBorrowedComponent(req.body);
  
    const {
      componentUUID,
      fullName,
      borrowerID,
      borrowerContact,
      departmentName,
      dateOfIssue,
      actualReturnDate,
      quantity,
      expectedReturnDate,
      purpose,
      reasonForBorrowing,
    } = req.body;
  
    const t = await sequelize.transaction();
  
    try {
      // Create the borrow record within the transaction
      const borrow = await BorrowedComponent.create(
        {
          componentUUID,
          fullName,
          borrowerID,
          borrowerContact,
          departmentName,
          dateOfIssue,
          quantity,
          actualReturnDate,
          expectedReturnDate,
          purpose,
          reasonForBorrowing,
        },
        { transaction: t }
      );
  
      if (!borrow) {
        await t.rollback();
        return res.status(400).json({ message: "Error when inserting the data" });
      }
  
      // Reduce the component quantity within the transaction
      const component = await Component.findOne({ where: { uuid: componentUUID }, transaction: t });

       if (!component) {
        await t.rollback();
        return res.status(404).json({ message: "Component not found" });
      }

      if (component.partNumber){
          component.status = true;
      }
      await component.save({ transaction: t });
  
      await t.commit();
      res.status(200).json({ message: "Successfully inserted the data to the database" });
  
    } catch (error) {
      await t.rollback();
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports.getBorrowedComponentById = async (req, res)=>{
    const { error, value } = uuidSchema.validate(req.params.id);

    if (error) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
  
    const uuid = value;

    try{
      const borrowersComponent = await BorrowedComponent.findOne({
        where: { uuid: uuid},
        include: [{
          model: Component,
          as: 'component',
          attributes: ['componentName', 'partNumber', 'componentType', 'status', 'condition']
        }]
      })

      if (!borrowersComponent){
        res.status(404).json({"message": "borrower not found"})
      }
      res.status(200).json(borrowersComponent)
    }catch(error){
      res.status(500).json({"error": error.message})
    }
  }
  module.exports.updateBorrowedComponents = async (req, res) => {
    const { error: uuidError, value: uuid } = uuidSchema.validate(req.params.id);
  
    if (uuidError) {
      return res.status(400).json({ message: "Invalid UUID format" });
    }
  
    const { error, value } = validateBorrowedComponent(req.body);
  
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
      const [updatedRows] = await BorrowedComponent.update(value, {
        where: { uuid: uuid }
      });
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Borrowed component not found" });
      }
  
      res.status(200).json({ message: "Borrowed component updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// In the borrow controller

module.exports.getBorrowersByComponent = async (req, res) => {
  const { error, value } = uuidSchema.validate(req.query.componentUUID);

  if (error) {
    return res.status(400).json({ message: "Invalid component UUID format" });
  }

  const componentUUID = value;

  try {
    const borrowers = await BorrowedComponent.findAll({
      where: { componentUUID },
      include: [{
        model: Component,
        as: 'component',
        attributes: ['componentName', 'partNumber', 'componentType', 'status', 'condition']
      }],
      order: [['dateOfIssue', 'DESC']]
    });

    if (!borrowers.length) {
      return res.status(404).json({ message: "No borrow history found for this component" });
    }

    res.status(200).json(borrowers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};