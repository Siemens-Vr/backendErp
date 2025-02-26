const { Folder, SubFolder,Document } = require('../models');
const { Op } = require('sequelize');  

module.exports.createFolder = async (req, res) => {

  try {
    const projectId = req.params.id;
    console.log(projectId)
    console.log(req.body)
    const { folderName} = req.body;


    const folder = await Folder.create({
      projectId,
      folderName,
    });

    console.log(folder)

    if (!folder) {
      return res.status(400).json({ error: 'Error creating the folder' });
    }

    res.status(201).json({
      status: "ok",
      data: {
        folder
      }
    });
  } catch (error) {
    console.log('Error in the folder controller', error);
    res.status(500).json({ error:  error.message });
  }
};


module.exports.getFolders = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Fetch folders for the project
    const folders = await Folder.findAll({ where: { projectId } });

    // Fetch documents where both folderId and subFolderId are null
    const files = await Document.findAll({
      where: {
        projectId,
        folderId: { [Op.is]: null },  
        subFolderId: { [Op.is]: null } 
      }
    });

    if (!folders || folders.length === 0) {
      return res.status(404).json({ error: "No folders found" });
    }

    // Combine the folders and files into one response object and send it
    res.status(200).json({ folders, files });
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports.getFolderData = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findByPk(folderId, {
      include: [{ model: SubFolder, as: 'subFolders' }]
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.updateFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { folderName, description } = req.body;

    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await folder.update({
      folderName,
      description
    });

    res.status(200).json(folder);
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Delete all subfolders associated with this folder
    await SubFolder.destroy({ where: { folderId } });

    // Delete the folder itself
    await folder.destroy();

    res.status(200).json({ message: "Folder and associated subfolders deleted successfully" });
  } catch (error) {
    console.log('Error in the folder controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};