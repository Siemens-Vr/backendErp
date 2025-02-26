const {Transport} = require("../models")
const { Op , Sequelize } = require('sequelize');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

function getOperatorForType(type, value) {
  if (type instanceof Sequelize.STRING) {
    return { [Op.iLike]: `%${value}%` };
  } else if (type instanceof Sequelize.INTEGER || type instanceof Sequelize.FLOAT || type instanceof Sequelize.DOUBLE) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? { [Op.eq]: null } : numValue;
  } else if (type instanceof Sequelize.BOOLEAN) {
    return value.toLowerCase() === 'true';
  } else if (type instanceof Sequelize.DATE) {
    return { [Op.eq]: new Date(value) };
  }
  // For other types, use equality
  return { [Op.eq]: value };
}

function isSearchableType(type) {
  return type instanceof Sequelize.STRING ||
         type instanceof Sequelize.INTEGER ||
         type instanceof Sequelize.FLOAT ||
         type instanceof Sequelize.DOUBLE ||
         type instanceof Sequelize.BOOLEAN ||
         type instanceof Sequelize.DATE;
}


module.exports.createTransport =async ( req, res)=>{
    const {projectId} = req.params
    const files = req.files || {};  
    const {destination, description, travelPeriod, travelers, dateOfRequest, dateReceived, approver, approvalDate, type, PvNo, claimNumber, accounted, dateAccounted,paymentDate, allowance, beneficiary } = req.body
    try{

            
            const transport = await Transport.create({
              projectId,
              destination,
              description,
              travelPeriod,
              travelers,
              dateOfRequest: dateOfRequest || null,
              dateReceived:  dateReceived || null,
              approver,
              approvalDate: approvalDate || null,
              type,
              PvNo,
              claimNumber,
              accounted,
              dateAccounted : dateAccounted || null,
              paymentDate: paymentDate || null, 
              allowance,
              beneficiary,

              document: files.transport ? `/uploads/transports/${files.transport[0].filename}` : null,

            });
      
            res.status(201).json({transport});


    }catch(error){
        console.error('Error creating transport entry :', error.message);
    return res.status(500).json({ error: 'Error creating transport entry', details: error.message });
    }
}  


// Get all transport requests
module.exports.getTransports = async (req, res) => {
  const {projectId} = req.params
try {
    const { q, filter, page = 0, size = 10 } = req.query;
    console.log(req.query)
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    // Get the actual column names and types from the Supplier model
    const attributes = Object.entries(Transport.rawAttributes).map(([name, attribute]) => ({
      name,
      type: attribute.type
    }));

    let whereClause = { projectId };
    let query = {};

    if (q) {
      if (filter && filter !== 'all' && attributes.some(attr => attr.name === filter)) {
        // If a specific filter is provided and it exists in the model
        const attribute = attributes.find(attr => attr.name === filter);
        whereClause[filter] = getOperatorForType(attribute.type, q);
      } else {
        // If no specific filter or 'all', search in all searchable fields
        whereClause[Op.or] = attributes
          .filter(attr => isSearchableType(attr.type))
          .map(attr => ({
            [attr.name]: getOperatorForType(attr.type, q)
          }));
      }
      query.where = whereClause;
    }

    // Always apply pagination and sorting
    query.order = [['createdAt', 'DESC']];
    query.limit = pageSize;
    query.offset = pageNumber * pageSize;

    const transports = await Transport.findAndCountAll(query);

    res.status(200).json({
      content: transports.rows,
      count: transports.count,
      totalPages: Math.ceil(transports.count / pageSize)
    });
  } catch (error) {
    console.error('Error fetching transport entries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  };
  
  // Get a single transport request by ID
  module.exports.getTransportById = async (req, res) => {
    try {
      const transport = await Transport.findByPk(req.params.id);
      if (!transport) {
        return res.status(404).json({ message: 'Transport request not found' });
      }
      res.status(200).json(transport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a transport request
  module.exports.updateTransport = async (req, res) => {
    const { id } = req.params;
    const {destination, description, travelPeriod, travelers, dateOfRequest, dateReceived, approver, approvalDate, type, PvNo, claimNumber, accounted, dateAccounted,paymentDate, allowance, beneficiary } = req.body

    const files = req.files || {};
    try {

        const transport = await Transport.findOne({where:{ uuid :id}})

        if(!transport) return res.status(404).json({error : "Trnsport entry not found"})

        // Helper function to delete old files
        const deleteOldFile = (folder, oldFilePath) => {
            if (!oldFilePath) return;
            const oldFileName = path.basename(oldFilePath);
            const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);
    
            if (fs.existsSync(oldFileFullPath)) {
            fs.unlinkSync(oldFileFullPath);
            console.log(`Deleted old file: ${oldFileFullPath}`);
            }
        };
    
        // Handle file updates
        if (files.transport && files.transport.length > 0) {
            // Delete old invoice
            deleteOldFile('transports', transport.document);
            transport.document = `/uploads/transports/${files.transport[0].filename}`;
          
        }

        
        await transport.update({
          dateOfRequest: req.body.dateOfRequest,
          approvedDate: req.body.approvedDate,
          approver: req.body.approver,
          dateReceived: req.body.dateReceived,
          travelers: req.body.travelers,
          description: req.body.description,
          travelPeriod: req.body.travelPeriod,
          destination: req.body.destination,
          document: files.transport ? `/uploads/transports/${files.transport[0].filename}` : null,
          type: req.body.type,
          allowance: req.body.allowance,
          beneficiary: req.body.beneficiary,
        });
  
        res.status(200).json(transport);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  module.exports.search = async (req, res) => {
    try {
      const { PvNo, claimNumber, amountClaimed, destination , description} = req.query;
      const conditions = {};
  
      if (PvNo) conditions.PvNo = { [Op.like]: `%${PvNo}%` };
      if (claimNumber) conditions.claimNumber = { [Op.like]: `%${claimNumber}%` };
      if (amountClaimed) conditions.amountClaimed = amountClaimed;
      // if (suppliers) conditions.suppliers = { [Op.like]: `%${suppliers}%` };
      if (project) conditions.project = { [Op.like]: `%${project}%` };
  
      const foundTransports = await Transport.findAll({ where: conditions });
  
      res.status(200).json(foundTransports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a transport request
  module.exports.deleteTransport = async (req, res) => {
    try {
      const transport = await Transport.findByPk(req.params.id);
      if (!transport) {
        return res.status(404).json({ message: 'Transport request not found' });
      }
  
      await transport.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };