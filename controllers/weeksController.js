const { Week, Facilitator, Level, Material, Video ,Image, File } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper function to check if facilitator and level exist
const checkFacilitatorAndLevel = async (facilitatorId, levelId) => {
  const facilitator = await Facilitator.findOne({ where: { uuid: facilitatorId } });
  const level = await Level.findOne({ where: { uuid: levelId } });
  return facilitator && level;
};

// Create a new week
exports.createWeek = async (req, res) => {
  const { title, weekname } = req.body;
  const { facilitatorId, levelId } = req.params;

  try {
    const validIds = await checkFacilitatorAndLevel(facilitatorId, levelId);
    if (!validIds) return res.status(404).json({ error: 'Facilitator or Level not found' });

    const newWeek = await Week.create({
      title,
      weekname,
      facilitatorId,
      levelId,
    });
    res.status(201).json(newWeek);
  } catch (error) {
    res.status(400).json({ error: 'Error creating week', details: error.message });
  }
};

// Get all weeks for a specific level
exports.getAllWeeks = async (req, res) => {
    const { levelId } = req.params;
  
    try {
      // Check if the level exists
      const level = await Level.findOne({ where: { uuid: levelId } });
      if (!level) return res.status(404).json({ error: 'Level not found' });
  
      // Find all weeks associated with the specified level
      const weeks = await Week.findAll({
        where: {
          levelId,
        },
      });
      res.status(200).json(weeks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching weeks', details: error.message });
    }
  }; 

// Get a single week by UUID for a specific level, including associated materials, videos, images, and files
exports.getWeekById = async (req, res) => {
  const { uuid, levelId } = req.params;

  try {
    // Check if the level exists
    const level = await Level.findOne({ where: { uuid: levelId } });
    if (!level) return res.status(404).json({ error: 'Level not found' });

    // Find the week by UUID and levelId, including associated materials, videos, images, and files
    const week = await Week.findOne({
      where: { uuid, levelId },
      include: [
        {
          model: Material,
          as: 'materials', 
          include: [
            {
              model: Video,
              as: 'videos', 
            },
            {
              model: Image,
              as: 'images', 
            },
            {
              model: File,
              as: 'files', 
            }
          ]
        }
      ]
    });

    if (week) {
      res.status(200).json(week);
    } else {
      res.status(404).json({ error: 'Week not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching week', details: error.message });
  }
};

// Update a week by UUID, facilitatorId, and levelId
exports.updateWeek = async (req, res) => {
  const { uuid, facilitatorId, levelId } = req.params;
  const { title, weekname } = req.body;

  try {
    const validIds = await checkFacilitatorAndLevel(facilitatorId, levelId);
    if (!validIds) return res.status(404).json({ error: 'Facilitator or Level not found' });

    const week = await Week.findOne({
      where: {
        uuid,
        facilitatorId,
        levelId,
      },
    });
    if (!week) return res.status(404).json({ error: 'Week not found' });

    await week.update({ title, weekname });
    res.status(200).json(week);
  } catch (error) {
    res.status(400).json({ error: 'Error updating week', details: error.message });
  }
};

// Delete a week by UUID, facilitatorId, and levelId, including its associated materials and files
exports.deleteWeek = async (req, res) => {
  const { uuid, facilitatorId, levelId } = req.params;

  let transaction;

  try {
    const validIds = await checkFacilitatorAndLevel(facilitatorId, levelId);
    if (!validIds) return res.status(404).json({ error: 'Facilitator or Level not found' });

    const week = await Week.findOne({
      where: { uuid, facilitatorId, levelId },
      include: [
        {
          model: Material,
          as: 'materials',
          include: [
            { model: Video, as: 'videos' },
            { model: Image, as: 'images' },
            { model: File, as: 'files' }
          ]
        }
      ]
    });

    if (!week) return res.status(404).json({ error: 'Week not found' });

    transaction = await Material.sequelize.transaction();

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

    // Delete associated materials
    await Promise.all(week.materials.map(async (material) => {
      // Delete associated videos
      material.videos.forEach(video => deleteOldFile('videos', video.path));

      // Delete associated images
      material.images.forEach(image => deleteOldFile('images', image.path));

      // Delete associated files
      material.files.forEach(file => deleteOldFile('files', file.path));

      // Delete old video records
      await Video.destroy({ where: { materialId: material.uuid }, transaction });

      // Delete old image records
      await Image.destroy({ where: { materialId: material.uuid }, transaction });

      // Delete old file records
      await File.destroy({ where: { materialId: material.uuid }, transaction });

      // Delete the material record
      await material.destroy({ transaction });
    }));

    // Delete the week record
    await week.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: 'Week and its associated materials and files have been deleted successfully' });
  } catch (error) {
    console.error('Error deleting week:', error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ error: 'Error deleting week', details: error.message });
  }
};

