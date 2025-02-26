const { Report } = require('../models');
const { Op , Sequelize } = require('sequelize');
const { upload } = require('../middleware/fileUploadMiddleware');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');




module.exports.getReports = async (req, res) => {
  const { projectId } = req.params;
  try {
   

    const reports = await Report.findAndCountAll({where: {projectId}});

    res.status(200).json({
   reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


module.exports.createReports = async (req, res) => {
  // console.log(req.files);
  console.log(req.body)
  const {projectId} = req.params
  const files = req.files || {};  


  try {

    // Create Supplier with file paths directly in the table
    const report = await Report.create({
      projectId,
      

      // Add file paths and names if present
      document: files.report ? `/uploads/reports/${files.report[0].filename}` : null,
     documentName: files.report ? files.report[0].originalname : null,
      

    });

    // Respond with the created supplier
    return res.status(201).json({ report });
  } catch (error) {
    console.error('Error creating report:', error.message);
    return res.status(500).json({ error: 'Error creating report', details: error.message });
  }
};


module.exports.getRecordById = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const report = await Report.findOne({  where: { uuid: id }, });
    if (!report) {
      return res.status(404).json({ message: 'report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateReport = async (req, res) => {
  const { id } = req.params;
  const files = req.files || {};
  // console.log(files)


  try {
    const report = await Report.findOne({ where: { uuid: id } });

    if (!report) {
      return res.status(404).json({ message: 'report not found' });
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
    if (files.report && files.report.length > 0) {
      // Delete old procurement
      deleteOldFile('reports', report.document);
      report.document = `/uploads/reports/${files.report[0].filename}`;
      report.documentName = files.report[0].originalname;
    }

    // console.log(report.document)
    // console.log(report.documentName)
   
    // Update supplier details
    await report.update({
      document:  report.document,
      documentName: report.documentName
  
    });

    res.status(200).json({ message: "Record information successfully updated" });
  } catch (error) {
    console.error('Error updating record', error);
    res.status(500).json({ error: 'Error updating  records', details: error.message });
  }
};


module.exports.deleteProcurement= async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findOne({ where: { uuid: id } });

    if (!report) {
      return res.status(404).json({ message: 'report not found' });
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
    if (report.document) {
      deleteOldFile('reports', report.document);
    }

    // Delete the supplier record
    await report.destroy();

    return res.status(200).json({ message: "report record and associated files successfully deleted" });
  } catch (error) {
    console.error('Error deleting report:', error);
    return res.status(500).json({ error: 'Error deleting report', details: error.message });
  }
};