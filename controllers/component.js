// const { where } = require('sequelize')
const { Component, ComponentsQuantity, BorrowedComponent, sequelize ,ConditionDetails }  = require('../models')
const multer = require('multer');
const XLSX = require('xlsx');
const { Op, fn, col } = require('sequelize');
const validateComponent = require('../validation/componentValidation');
const validateComponentsQuantity = require('../validation/componentsquantityValidation');
const Joi = require('joi');



const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });


module.exports.getComponents = async (req, res) => {
  // console.log("running")

  const componentType = req.params.componentsType;
  const partNumber = req.query.q;

  try {
    let components;
    if (partNumber) {
      components = await Component.findAndCountAll({
        where: {
          componentType: componentType,
          partNumber: {
            [Op.iLike]: `%${partNumber}%`
          }
        }
      });
    } else {
      components = await Component.findAndCountAll({
        where: {
          componentType: componentType
        }
      });
    }

    // Log the components object for debugging
    // console.log("Fetched Components:", components);

    if (!components || components.rows.length === 0) {
      return res.status(404).json({ "message": "No components found" });
    }

    // Map over components to add `totalQuantity`, `borrowedQuantity`, and `remainingQuantity`
    const componentData = await Promise.all(components.rows.map(async (component) => {
      // Get the total quantity of the component
      const totalQuantityResult = await ComponentsQuantity.sum('quantity', {
        where: { componentUUID: component.uuid }
      });
      
      // Get the total borrowed quantity of the component
      const borrowedQuantityResult = await BorrowedComponent.sum('quantity', {
        where: { componentUUID: component.uuid }
      });

      // Calculate `totalQuantity`, `borrowedQuantity`, and `remainingQuantity`
      const totalQuantity = totalQuantityResult || 0;
      const borrowedQuantity = borrowedQuantityResult || 0;
      const remainingQuantity = totalQuantity - borrowedQuantity;

      return {
        ...component.toJSON(),
        totalQuantity,
        borrowedQuantity,
        remainingQuantity
      };
    }));

    // Log the final data to be sent in the response
    // console.log("Component Data:", { count: components.count, rows: componentData });

    // Send the response with the component data
    res.status(200).json({ count: components.count, rows: componentData });
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ "message": "Internal server error" });
  }
};



module.exports.updateComponentQuantity = async (req, res) => {
    const componentId = req.params.id;
    // console.log(c)
    const { quantity } = req.body;

    // console.log("Component ID: ", componentId);

    const transaction = await sequelize.transaction();

    try {
      const component = await Component.findOne({ where: { uuid: componentId }, transaction });

      if (component) {
        await ComponentsQuantity.create(
          {
            componentUUID: componentId,
            quantity,
          },
          {
            transaction
          }
        );

        await transaction.commit();

        res.status(200).json({ message: "Quantity updated successfully" });
      } else {
        await transaction.rollback();
        res.status(404).json({ message: "Component not found" });
      }
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },



module.exports.getComponentsType = async (req, res) => {
  const name = req.query.q;
  let components;
  

  try {
    if (name) {
      components = await Component.findAll({
        attributes: [
          'componentType',
          [sequelize.fn('sum', sequelize.col('ComponentsQuantities.quantity')), 'totalQuantity'],
          [sequelize.fn('sum', sequelize.col('BorrowedComponents.quantity')), 'totalBorrowedQuantity'],
        ],
        include: [
          {
            model: ComponentsQuantity,
            as: 'ComponentsQuantities', 
            attributes: [],  // No need to include quantity data from this join
          },
          {
            model: BorrowedComponent,
            attributes: [],  // No need to include quantity data from this join
          },
        ],
        group: ['componentType'],
        where: {
          componentType: {
            [Op.iLike]: `%${name}%`
          }
        },
        order:[['componentType', 'ASC']],
        raw: true,  // Return plain data objects
      });

    } else {
      components = await Component.findAll({
        attributes: [
          'componentType',
          [sequelize.fn('sum', sequelize.col('ComponentsQuantities.quantity')), 'totalQuantity'],
          [sequelize.fn('sum', sequelize.col('BorrowedComponents.quantity')), 'totalBorrowedQuantity'],
        ],
        include: [
          {
            model: ComponentsQuantity,
            as: 'ComponentsQuantities',
            attributes: [],  // No need to include quantity data from this join
          },
          {
            model: BorrowedComponent,
            attributes: [],  // No need to include quantity data from this join
          },
        ],
        group: ['componentType'],
        order:[['componentType', 'ASC']],
        raw: true,  // Return plain data objects
      });
    }

    // Process data to include remainingQuantity
    const result = components.map(component => ({
      componentType: component.componentType,
      totalQuantity: component.totalQuantity || 0,
      borrowedQuantity: component.totalBorrowedQuantity || 0,
      remainingQuantity: (component.totalQuantity || 0) - (component.totalBorrowedQuantity || 0),
    }));

    if (result.length > 0) {
      console.log(result)
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No components found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.createComponent = async (req, res) => {
  console.log(req.body);

  const { componentName, componentType, partNumber, modelNumber, description, quantity, status,  conditions } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Create the component first
    const component = await Component.create(
      { componentName, componentType, modelNumber, partNumber, description, status,  },
      { transaction }
    );

    if (component) {
      // Add quantity to ComponentsQuantity table
      await ComponentsQuantity.create(
        { componentUUID: component.uuid, quantity },
        { transaction }
      );

      if (conditions && conditions.length > 0) {
        const conditionPromises = conditions.map((cond) =>
          ConditionDetails.create(
            {
              componentId: component.uuid, // Use component.id to link to the component
              status: cond.status,
              quantity: cond.quantity,
              details: cond.details,
            },
            { transaction }
          )
        );
        await Promise.all(conditionPromises);
      }

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({ message: "Component created successfully" });
    } else {
      // Rollback transaction if something went wrong
      await transaction.rollback();
      res.status(404).json({ message: "Error creating component" });
    }
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};



module.exports.uploadComponents = async (req, res) => {
  const transaction = await sequelize.transaction();
  console.log("File uploaded:", req.file);

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

    // Logging the received data
    // console.log('Received components data:', worksheet);

    for (const row of worksheet) {
      const { componentName, componentType, modelNumber, partNumber, description, quantity } = row;

      const component = await Component.create(
        { componentName, componentType, modelNumber, partNumber, description,quantity },
        { transaction }
      );

      if (component) {
        await ComponentsQuantity.create(
          { componentUUID: component.uuid, quantity },
          { transaction }
        );
      } else {
        throw new Error("Error creating component");
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Components created successfully" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ message: "An error occurred while processing the file" });
  }
};


  

module.exports.updateComponent = async (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const { error } = validateComponent(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(err => err.message) });
  }
  const { componentName, componentType, modelNumber,partNumber, description,quantity, status, condition, conditionDetails } = req.body;

  const transaction = await sequelize.transaction();

  try {
      // Find the component by UUID
      const component = await Component.findOne({ where: { uuid: id }, transaction });

      if (component) {
          // Update the component details
          await Component.update(
              {
                  componentName: componentName || component.componentName,
                  componentType: componentType || component.componentType,
                  modelNumber :modelNumber || component.modelNumber,
                  description: description || component.description,
                  partNumber: partNumber || component.partNumber,
                  quantity: quantity !== undefined ? quantity : component.quantity,
                  status: status !== undefined ? status : component.status,
                  condition: condition !== undefined ? condition : component.condition,
                  conditionDetails: conditionDetails || component.conditionDetails,
              },
              {
                  where: { uuid: id },
                  transaction
              }
          );
          if (quantity !== undefined) {
              await ComponentsQuantity.create(
                  {
                      componentId: id,
                      quantity,
                  },
                  {
                      transaction
                  }
              );
          }

          // Commit the transaction
          await transaction.commit();

          res.status(200).json({ message: "Component updated successfully" });
      } else {
          // If component is not found, rollback the transaction
          await transaction.rollback();
          res.status(404).json({ message: "Component not found" });
      }
  } catch (error) {
      // If an error occurred, rollback the transaction
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

module.exports.updateComponentQuantity= async (req, res) => {
  console.log(req.body)
  const { error } = validateComponentsQuantity(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(err => err.message) });
  }
    const componentId = req.params.id;
    const { quantity } = req.body;

    console.log("Component ID: ", componentId);

    const transaction = await sequelize.transaction();

    try {
      const component = await Component.findOne({ where: { uuid: componentId }, transaction });

      if (component) {
        await ComponentsQuantity.create(
          {
            componentUUID: componentId,
            quantity,
          },
          {
            transaction
          }
        );

        await transaction.commit();

        res.status(200).json({ message: "Quantity updated successfully" });
      } else {
        await transaction.rollback();
        res.status(404).json({ message: "Component not found" });
      }
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },




module.exports.getComponentById = async (req, res)=>{
    const id = req.params.id
    try{
        const component = await Component.findOne({where: {uuid: id}})
            if(component){
                res.status(200).json(component)
                }
                // res.status(200).json(component)
            }

    catch(error)
    {
        res.status(500).json({"message": error.message})
    }
    
}

module.exports.deleteComponent = async (req, res)=>{

    const id = req.params.id

    try{
        const deletedComponent = await Component.destroy({where: { uuid: id}})

    }catch(error){
        res.status(500).json({"message": error.message})
    }

}

module.exports.search =async(req, res)=>{
  const name = req.body.name

  try{
    const searchedData = await Component.find({where: {firstName: name }})

  }catch(error){

  }
}

// module.exports.getComponentHistory = async (req, res)=>{
//   const componentUUID = req.params.id;

//   try{
//         const history = await ComponentsQuantity.findAll({
//       where: { componentUUID},
//         })

//         res.status(200).json(history)

//   }catch(error){
//     console.log(error)
//   }
// }


module.exports.getComponentHistory = async (req, res) => {
  const componentId = req.params.id;
  // console.log(componentId)

  try {
    
    if (!componentId) {
      return res.status(400).json({ message: "Component ID is required" });
    }

    const history = await ComponentsQuantity.findAll({
      where: { componentUUID: componentId },
      include: [
        {
          model: Component,
          as: 'Component',
          attributes: ['status', 'condition']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${history.length} history records`);

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No history found for this component" });
    }

    const formattedHistory = history.map((record, index) => {
      const prevRecord = history[index + 1];
      const quantityChange = prevRecord ? record.quantity - prevRecord.quantity : record.quantity;
      
      return {
        createdAt: record.createdAt,
        action: quantityChange > 0 ? 'Added' : 'Removed',
        quantityChange: Math.abs(quantityChange),
        newTotalQuantity: record.quantity,
        status: record.Component.status,
        condition: record.Component.condition
      };
    });

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Error in getComponentHistory:", error);
    if (error.name === 'SequelizeConnectionError') {
      return res.status(500).json({ message: "Database connection error" });
    } else if (error.name === 'SequelizeQueryError') {
      return res.status(500).json({ message: "Database query error" });
    } else {
      return res.status(500).json({ 
        message: "Internal server error", 
        error: error.message, 
        stack: error.stack 
      });
    }
  }
};


