const { StudentLevels, Facilitator, Student,Level, LevelFacilitators , HoursWorked} = require('../models');
const validateLevel = require('../validation/levelValidation'); 
const Joi = require('joi');
//
const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

module.exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.findAll();
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.createLevel = async (req, res) => {

  const { levelName, startDate, endDate, cohortId, exam_dates, exam_quotation_number, facilitators } = req.body;
  let leveldata;

  if (exam_dates === '') {
    leveldata = { levelName, startDate, endDate, cohortId, exam_quotation_number, facilitators };
  } else {
    leveldata = { levelName, startDate, endDate, cohortId, exam_dates, exam_quotation_number, facilitators };
  }

  try {
    const level = await Level.create(leveldata);

    if (level) {
      const levelId = level.uuid;

      for (const facilitator of facilitators) {
        await LevelFacilitators.create({ levelId, facilitatorId: facilitator.value, specification: facilitator.role });
      }
    }

    res.status(201).json({ message: "Level created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getLevelById = async (req, res) => {
  const { uuid } = req.params;
  // console.log(uuid)

  try {
    const level = await Level.findAll({ where: { cohortId: uuid } });

    if (!level) {
      res.status(404).json({ error: "The level does not exist" });
    }

    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getLevelDataById = async (req, res) => {
  const { cohortId, levelId } = req.params;

  try {
    // Find the specific level within a cohort by UUID with associated students and facilitators
    const level = await Level.findOne({
      where: { uuid: levelId, cohortId: cohortId },
      include: [
        {
          model: StudentLevels,
          as: 'studentLevels',
          include: [{ model: Student, as: 'student' }],
        },
        {
          model: Facilitator,
          as: 'facilitators',  // Include facilitators through LevelFacilitators
          through: {
            attributes: ['specification'],  // Additional attributes from the join table if needed
          },
        },
      ],
    });

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Format the level data to send back to the frontend
    const levelData = {
      uuid: level.uuid,
      levelName: level.levelName,
      startDate: level.startDate,
      endDate: level.endDate,
      examDates: level.exam_dates,
      examQuotationNumber: level.exam_quotation_number,
      students: level.studentLevels.map((sl) => sl.student),
      facilitators: level.facilitators.map((facilitator) => ({
        uuid:facilitator.uuid,
        firstName: facilitator.firstName,
        lastName: facilitator.lastName,
        phone:facilitator.phoneNo,
        specification: facilitator.LevelFacilitators.specification, // Access specification through the join table
      })),
    };

    res.status(200).json(levelData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



module.exports.updateLevel = async (req, res) => {
  const { uuid } = req.params;
  // console.log(uuid)
  const level = req.body;
  // console.log(level)

  try {
    const updateLevel = await Level.update(level, { where: { uuid } });

    if (!updateLevel[0]) {
      return res.status(404).json({ error: 'Level not found' });
    }

    res.status(200).json({ message: 'Level updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.addHours = async (req, res) => {
  
  const facilitatorUUID = req.params.id;
  const levelUUID = req.params.levelUUID
  const { entries } = req.body; 

  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: "Invalid input: expected an array of entries" });
  }

  try {
    // Map entries to an array suitable for bulkCreate
    const hoursData = entries.map(entry => ({
      day: entry.day,
      hours: entry.hours,
      facilitatorUUID: facilitatorUUID, 
      levelUUID: levelUUID,
    }));

    // Perform bulk create
    const createdHours = await HoursWorked.bulkCreate(hoursData);

    if (createdHours.length > 0) {
      res.status(200).json({ message: 'Hours updated successfully' });
    } else {
      res.status(200).json({ message: 'No hours updated' });
    }
  } catch (error) {
    console.error('Error adding hours:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getHours = async (req, res)=>{
  const {id} = req.params
  // console.log(id)

  try{

    const hours = await HoursWorked.findAll({where: {facilitatorUUID: id}})

    if(!hours){
      res.status(404).json({"message": "Error fetching data"})
    }
    res.status(200).json(hours)

  }catch(error){
    res.status(500).json(error.message)

  }
}
module.exports.deleteLevel = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteLevel = await Level.destroy({ where: { uuid: id } });

    if (deleteLevel) {
      res.status(200).json({ message: "Level deleted successfully" });
    } else {
      res.status(404).json({ error: "Level not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
