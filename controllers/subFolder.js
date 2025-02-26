const { SubFolder, Folder } = require('../models');

module.exports.createSubFolder = async (req, res) => {
  try {
    const uuid = req.params.folderId; // folderId in request
    const projectId = req.params.projectId;
    const { folderName, parentFolderId } = req.body;

    let parentFolder;
    let isSubFolder = false; // Flag to track whether parentFolder is a SubFolder

    // Check if the parent folder is a Folder
    parentFolder = await Folder.findByPk(uuid);

    if (!parentFolder) {
      // Check if the parent folder is a SubFolder
      parentFolder = await SubFolder.findByPk(parentFolderId);
      if (parentFolder) {
        isSubFolder = true; // Mark as SubFolder
      }
    }

    if (!parentFolder) {
      return res.status(404).json({ error: 'Parent folder not found' });
    }

    // Create the subfolder
    const subFolder = await SubFolder.create({
      folderId: isSubFolder ? null : uuid, // Use folderId only if it's a Folder
      subFolderId: isSubFolder ? parentFolderId : null, // Use subFolderId only if parentFolder is a SubFolder
      projectId,
      folderName,
    });

    return res.status(201).json(subFolder);
  } catch (error) {
    console.error('Error in the subfolder controller:', error.message);
    res.status(500).json({ error: error.message });
  }
};

    
    module.exports.getSubFolders = async (req, res) => {
      try {
        const folderId = req.params.folderId;
        const subFolders = await SubFolder.findAll({ where: { folderId } });
    
        if (!subFolders) {
          return res.status(404).json({ error: "Error fetching subfolders" });
        }
    
        res.status(200).json(subFolders);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: error.message });
      }
    };
    
    module.exports.getSubFolderData = async (req, res) => {
      try {
        const { folderUuid, subFolderUuid } = req.params;
    
        // Find the folder by UUID
        const folder = await Folder.findOne({ where: { uuid: folderUuid } });
        if (!folder) return res.status(404).json({ error: 'Folder not found' });
    
        // Find the subfolder by UUID and check if it belongs to the folder
        const subFolder = await SubFolder.findOne({ where: { uuid: subFolderUuid, folderId: folder.id } });
        if (!subFolder) return res.status(404).json({ error: 'Subfolder not found' });
    
        // Fetch the documents that belong to this specific subfolder
        const documents = await Document.findAll({
          where: {
            folderId: folder.id, 
            subFolderId: subFolder.id 
          }
        });
    
        // Return the subfolder data along with the documents inside it
        return res.status(200).json({
          status: "ok",
          documents: documents
        });
      } catch (error) {
        console.error('Error fetching subfolder data:', error);
        return res.status(500).json({ error: 'Failed to fetch subfolder data' });
      }
    };
    
    module.exports.updateSubFolder = async (req, res) => {
      try {
        const subFolderId = req.params.subFolderId;
        const { name, description } = req.body;
    
        const subFolder = await SubFolder.findByPk(subFolderId);
    
        if (!subFolder) {
          return res.status(404).json({ error: "Subfolder not found" });
        }
    
        await subFolder.update({
          folderName: name,
          description
        });
    
        res.status(200).json(subFolder);
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    module.exports.deleteSubFolder = async (req, res) => {
      try {
        const subFolderId = req.params.subFolderId;
        const subFolder = await SubFolder.findByPk(subFolderId);
    
        if (!subFolder) {
          return res.status(404).json({ error: "Subfolder not found" });
        }
    
        await subFolder.destroy();
    
        res.status(200).json({ message: "Subfolder deleted successfully" });
      } catch (error) {
        console.log('Error in the subfolder controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

  