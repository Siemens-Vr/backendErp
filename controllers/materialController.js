const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Material, Video, Image, File, Week } = require('../models');

exports.createMaterialWithFiles = async (req, res) => {
  const { title, description, duration } = req.body;
  const { weekuuid } = req.params;
  const files = req.files || {};
  
  let transaction;
  
  try {
    transaction = await Material.sequelize.transaction();

    // Validate Week if weekuuid is provided
    let week;
    if (weekuuid) {
      week = await Week.findOne({ 
        where: { uuid: weekuuid },
        transaction 
      });
      if (!week) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Week not found' });
      }
    }

    // Create Material
    const material = await Material.create({
      title,
      description,
      duration,
      weekId: week.uuid , 
    }, { transaction });

    // Handle Videos if present
    if (files.videos && files.videos.length > 0) {
      await Promise.all(files.videos.map(video => 
        Video.create({
          materialId: material.uuid,
          name: video.originalname,
          path: `videos/${video.filename}`,
        }, { transaction })
      ));
    }

    // Handle Images if present
    if (files.images && files.images.length > 0) {
      await Promise.all(files.images.map(image => 
        Image.create({
          materialId: material.uuid,
          name: image.originalname,
          path: `images/${image.filename}`,
        }, { transaction })
      ));
    }

    // Handle Files if present
    if (files.files && files.files.length > 0) {
      await Promise.all(files.files.map(file => 
        File.create({
          materialId: material.uuid,
          name: file.originalname,
          path: `files/${file.filename}`,
        }, { transaction })
      ));
    }

    await transaction.commit();
    
    // Fetch the created material with its associations
    const createdMaterial = await Material.findOne({
      where: { uuid: material.uuid },
      include: [
        { model: Video },  
        { model: Image },  
        { model: File }    
      ]
    });

    return res.status(201).json({ material: createdMaterial });
  } catch (error) {
    console.error('Error creating material:', error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ error: 'Error creating material', details: error.message });
  }
};

exports.getAllMaterials = async (req, res) => {
    const { weekuuid } = req.params;
  
    try {
      // Check if the week exists
      const week = await Week.findOne({ where: { uuid: weekuuid } });
      if (!week) {
        return res.status(404).json({ error: 'Week not found' });
      }
  
      // Retrieve materials associated with the week and their related files
      const materials = await Material.findAll({
        where: { weekId: week.uuid }, 
        include: [
          {
            model: Video,
            as: 'videos',
            where: { materialId: { [Op.eq]: Material.sequelize.col('Material.uuid') } }, 
            required: false
          },
          {
            model: Image,
            as: 'images',
            where: { materialId: { [Op.eq]: Material.sequelize.col('Material.uuid') } },
            required: false
          },
          {
            model: File,
            as: 'files',
            where: { materialId: { [Op.eq]: Material.sequelize.col('Material.uuid') } },
            required: false
          }
        ]
      });
  
      return res.status(200).json({ materials });
    } catch (error) {
      console.error('Error fetching materials:', error);
      return res.status(500).json({ error: 'Error fetching materials', details: error.message });
    }
  };
  

  exports.getMaterialById = async (req, res) => {
    const { uuid, weekuuid } = req.params;
  
    try {
      // Check if the week exists
      const week = await Week.findOne({ where: { uuid: weekuuid } });
      if (!week) {
        return res.status(404).json({ error: 'Week not found' });
      }
  
      // Retrieve the material associated with the week and uuid
      const material = await Material.findOne({
        where: { uuid, weekId: weekuuid },
        include: [
          {
            model: Video,
            where: { materialId: uuid },
            required: false
          },
          {
            model: Image,
            where: { materialId: uuid },
            required: false
          },
          {
            model: File,
            where: { materialId: uuid },
            required: false
          }
        ]
      });
  
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
  
      return res.status(200).json({ material });
    } catch (error) {
      console.error('Error fetching material by ID:', error);
      return res.status(500).json({ error: 'Error fetching material by ID', details: error.message });
    }
  };

  exports.getMaterialById = async (req, res) => {
    const { uuid, weekuuid } = req.params;
  
    try {
      // Check if the week exists
      const week = await Week.findOne({ where: { uuid: weekuuid } });
      if (!week) {
        return res.status(404).json({ error: 'Week not found' });
      }
  
      // Retrieve the material associated with the week and uuid
      const material = await Material.findOne({
        where: { uuid: uuid, weekId: week.uuid }, 
        include: [
          {
            model: Video,
            as: 'videos',
            where: { materialId: uuid }, 
            required: false
          },
          {
            model: Image,
            as: 'images',
            where: { materialId: uuid },
            required: false
          },
          {
            model: File,
            as: 'files',
            where: { materialId: uuid },
            required: false
          }
        ]
      });
  
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
  
      return res.status(200).json({ material });
    } catch (error) {
      console.error('Error fetching material by ID:', error);
      return res.status(500).json({ error: 'Error fetching material by ID', details: error.message });
    }
  };
  
  
  exports.updateMaterial = async (req, res) => {
    const { uuid, weekuuid } = req.params;
    const { title, description, duration } = req.body;
    const files = req.files || {};
  
    let transaction;
  
    try {
      transaction = await Material.sequelize.transaction();
  
      // Check if the week exists
      const week = await Week.findOne({ where: { uuid: weekuuid } });
      if (!week) {
        return res.status(404).json({ error: 'Week not found' });
      }
  
      // Find the material to update and fetch the old files (videos, images, files)
      const material = await Material.findOne({
        where: { uuid, weekId: week.uuid },
        include: [
          { model: Video, as: 'videos' },
          { model: Image, as: 'images' },
          { model: File, as: 'files' }
        ]
      });
  
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }
  
      // Update the material details
      await material.update({ title, description, duration }, { transaction });
  
      // Helper function to delete old files
      const deleteOldFile = (folder, oldFilePath) => {
        const oldFileName = path.basename(oldFilePath); 
        const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);
  
        if (fs.existsSync(oldFileFullPath)) {
          fs.unlinkSync(oldFileFullPath); 
          console.log(`Deleted old file: ${oldFileFullPath}`);
        }
      };
  
      // Handle video updates
      if (files.videos && files.videos.length > 0) {
        // Delete old videos
        material.videos.forEach(video => {
          deleteOldFile('videos', video.path); 
        });
  
        // Delete old video records
        await Video.destroy({ where: { materialId: material.uuid }, transaction });
  
        // Create new video records
        await Promise.all(files.videos.map(video =>
          Video.create({
            materialId: material.uuid,
            name: video.originalname,
            path: `videos/${video.filename}`,
          }, { transaction })
        ));
      }
  
      // Handle image updates
      if (files.images && files.images.length > 0) {
        // Delete old images
        material.images.forEach(image => {
          deleteOldFile('images', image.path); 
        });
  
        // Delete old image records
        await Image.destroy({ where: { materialId: material.uuid }, transaction });
  
        // Create new image records
        await Promise.all(files.images.map(image =>
          Image.create({
            materialId: material.uuid,
            name: image.originalname,
            path: `images/${image.filename}`,
          }, { transaction })
        ));
      }
  
      // Handle file updates
      if (files.files && files.files.length > 0) {
        // Delete old files
        material.files.forEach(file => {
          deleteOldFile('files', file.path); 
        });
  
        // Delete old file records
        await File.destroy({ where: { materialId: material.uuid }, transaction });
  
        // Create new file records
        await Promise.all(files.files.map(file =>
          File.create({
            materialId: material.uuid,
            name: file.originalname,
            path: `files/${file.filename}`,
          }, { transaction })
        ));
      }
  
      await transaction.commit();
  
      // Fetch updated material with its associations
      const updatedMaterial = await Material.findOne({
        where: { uuid: material.uuid },
        include: [
          { model: Video, as: 'videos' },
          { model: Image, as: 'images' },
          { model: File, as: 'files' }
        ]
      });
  
      return res.status(200).json({ message: "Material Updated successfully", material: updatedMaterial });
    } catch (error) {
      console.error('Error updating material:', error);
      if (transaction) await transaction.rollback();
      return res.status(500).json({ error: 'Error updating material', details: error.message });
    }
  };

exports.deleteMaterial = async (req, res) => {
  const { uuid, weekuuid } = req.params;

  let transaction;

  try {
    transaction = await Material.sequelize.transaction();

    // Check if the week exists
    const week = await Week.findOne({ where: { uuid: weekuuid } });
    if (!week) {
      return res.status(404).json({ error: 'Week not found' });
    }

    // Find the material to delete and fetch the associated files
    const material = await Material.findOne({
      where: { uuid, weekId: week.uuid },
      include: [
        { model: Video, as: 'videos' },
        { model: Image, as: 'images' },
        { model: File, as: 'files' }
      ]
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Helper function to delete old files
    const deleteOldFile = (folder, oldFilePath) => {
      const oldFileName = path.basename(oldFilePath); 
      const oldFileFullPath = path.join(__dirname, `../uploads/${folder}/${oldFileName}`);

      // Check if file exists before deleting
      if (fs.existsSync(oldFileFullPath)) {
        fs.unlinkSync(oldFileFullPath); 
        console.log(`Deleted old file: ${oldFileFullPath}`);
      } else {
        console.log(`File not found: ${oldFileFullPath}`);
      }
    };

    // Delete associated videos
    material.videos.forEach(video => {
      deleteOldFile('videos', video.path); 
    });

    // Delete associated images
    material.images.forEach(image => {
      deleteOldFile('images', image.path); 
    });

    // Delete associated files
    material.files.forEach(file => {
      deleteOldFile('files', file.path); 
    });

    // Delete old video records
    await Video.destroy({ where: { materialId: material.uuid }, transaction });

    // Delete old image records
    await Image.destroy({ where: { materialId: material.uuid }, transaction });

    // Delete old file records
    await File.destroy({ where: { materialId: material.uuid }, transaction });

    // Delete the material record
    await material.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: 'Material and its associated files have been deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ error: 'Error deleting material', details: error.message });
  }
};
