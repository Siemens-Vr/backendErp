const { Supplier } = require('../models');
const validateSupplier = require('../validation/supplierValidation');
const { Op , Sequelize } = require('sequelize');
const { upload } = require('../middleware/fileUploadMiddleware');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

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
module.exports.getSuppliers = async (req, res) => {
  try {
    const { q, filter, page = 0, size = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    // Get the actual column names and types from the Supplier model
    const attributes = Object.entries(Supplier.rawAttributes).map(([name, attribute]) => ({
      name,
      type: attribute.type
    }));

    let whereClause = {};
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

    const suppliers = await Supplier.findAndCountAll(query);

    res.status(200).json({
      content: suppliers.rows,
      count: suppliers.count,
      totalPages: Math.ceil(suppliers.count / pageSize)
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports.createSupplier = async (req, res) => {
  // console.log(req.files);
  console.log(req.body)
  const { suppliers, itemDescription, amountClaimed, approver, dateTakenToApprover, dateTakenToFinance, type, PvNo, claimNumber, accounted, dateAccounted, project, invoiceDate, paymentDate, approvalDate } = req.body;
  const files = req.files || {};  


  try {

    // Create Supplier with file paths directly in the table
    const supplier = await Supplier.create({
      suppliers,
      itemDescription,
      amountClaimed,
      approver,
      dateTakenToApprover: dateTakenToApprover || null,
      approvalDate: approvalDate || null,
      paymentDate: paymentDate || null,
      invoiceDate: invoiceDate || null,
      dateTakenToFinance: dateTakenToFinance || null,
      type,
      claimNumber,
      PvNo,
      accounted,
      dateAccounted: dateAccounted || null,
      project,
      // approval,
      // payment,
      // invoice,

      // Add file paths and names if present
      invoicePath: files.invoice ? `/uploads/invoices/${files.invoice[0].filename}` : null,
      invoiceName: files.invoice ? files.invoice[0].originalname : null,
      
      paymentVoucherPath: files.voucher ? `/uploads/vouchers/${files.voucher[0].filename}` : null,
      paymentVoucherName: files.voucher ? files.voucher[0].originalname : null,
      
      approvalPath: files.approval ? `/uploads/approvals/${files.approval[0].filename}` : null,
      approvalName: files.approval ? files.approval[0].originalname : null,
    });

    // Respond with the created supplier
    return res.status(201).json({ supplier });
  } catch (error) {
    console.error('Error creating supplier:', error.message);
    return res.status(500).json({ error: 'Error creating supplier', details: error.message });
  }
};


module.exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({  where: { uuid: id }, });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};
  const {
    suppliers,
    itemDescription,
    amountClaimed,
    approver,
    dateTakenToApprover,
    dateTakenToFinance,
    type,
    PvNo,
    claimNumber,
    accounted,
    dateAccounted,
    project,
    invoiceDate,
    paymentDate,
    approvalDate,
  } = req.body;

  try {
    const supplier = await Supplier.findOne({ where: { uuid: id } });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

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
    if (files.invoice && files.invoice.length > 0) {
      // Delete old invoice
      deleteOldFile('invoices', supplier.invoicePath);
      supplier.invoicePath = `/uploads/invoices/${files.invoice[0].filename}`;
      supplier.invoiceName = files.invoice[0].originalname;
    }

    if (files.voucher && files.voucher.length > 0) {
      // Delete old voucher
      deleteOldFile('vouchers', supplier.paymentVoucherPath);
      supplier.paymentVoucherPath = `/uploads/vouchers/${files.voucher[0].filename}`;
      supplier.paymentVoucherName = files.voucher[0].originalname;
    }

    if (files.approval && files.approval.length > 0) {
      // Delete old approval
      deleteOldFile('approvals', supplier.approvalPath);
      supplier.approvalPath = `/uploads/approvals/${files.approval[0].filename}`;
      supplier.approvalName = files.approval[0].originalname;
    }

    // Update supplier details
    await supplier.update({
      suppliers: suppliers || supplier.suppliers,
      itemDescription: itemDescription || supplier.itemDescription,
      amountClaimed: amountClaimed || supplier.amountClaimed,
      approver: approver || supplier.approver,
      dateTakenToApprover: dateTakenToApprover || supplier.dateTakenToApprover,
      dateTakenToFinance: dateTakenToFinance || supplier.dateTakenToFinance,
      type: type || supplier.type,
      PvNo: PvNo || supplier.PvNo,
      claimNumber: claimNumber || supplier.claimNumber,
      accounted: accounted !== undefined ? accounted : supplier.accounted,
      dateAccounted: dateAccounted || supplier.dateAccounted,
      project: project || supplier.project,
      invoiceDate: invoiceDate || supplier.invoiceDate,
      paymentDate: paymentDate || supplier.paymentDate,
      approvalDate: approvalDate || supplier.approvalDate,
      invoicePath: supplier.invoicePath,
      invoiceName: supplier.invoiceName,
      paymentVoucherPath: supplier.paymentVoucherPath,
      paymentVoucherName: supplier.paymentVoucherName,
      approvalPath: supplier.approvalPath,
      approvalName: supplier.approvalName,
    });

    res.status(200).json({ message: "Supplier information successfully updated" });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Error updating supplier', details: error.message });
  }
};
module.exports.search = async (req, res) => {
  try {
    const { PvNo, claimNumber, amountClaimed, suppliers , project } = req.query;
    const conditions = {};

    if (PvNo) conditions.PvNo = { [Op.like]: `%${PvNo}%` };
    if (claimNumber) conditions.claimNumber = { [Op.like]: `%${claimNumber}%` };
    if (amountClaimed) conditions.amountClaimed = amountClaimed;
    if (suppliers) conditions.suppliers = { [Op.like]: `%${suppliers}%` };
    if (project) conditions.project = { [Op.like]: `%${project}%` };

    const foundSuppliers = await Supplier.findAll({ where: conditions });

    res.status(200).json(foundSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({ where: { uuid: id } });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Helper function to delete files
    const deleteOldFile = (folder, oldFilePath) => {
      if (!oldFilePath) return;
      const oldFileName = path.basename(oldFilePath);
      const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);

      // Check if file exists before deleting
      if (fs.existsSync(oldFileFullPath)) {
        fs.unlinkSync(oldFileFullPath);
        console.log(`Deleted file: ${oldFileFullPath}`);
      } else {
        console.log(`File not found: ${oldFileFullPath}`);
      }
    };

    // Delete associated files
    if (supplier.invoicePath) {
      deleteOldFile('invoices', supplier.invoicePath);
    }

    if (supplier.paymentVoucherPath) {
      deleteOldFile('vouchers', supplier.paymentVoucherPath);
    }

    if (supplier.approvalPath) {
      deleteOldFile('approvals', supplier.approvalPath);
    }

    // Delete the supplier record
    await supplier.destroy();

    return res.status(200).json({ message: "Supplier record and associated files successfully deleted" });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ error: 'Error deleting supplier', details: error.message });
  }
};