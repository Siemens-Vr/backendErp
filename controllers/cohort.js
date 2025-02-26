
const {  sequelize, Cohort, Level, Student, StudentLevels, Facilitator, LevelFacilitators } = require('../models');
const Sequelize = require('sequelize'); // Import Sequelize
const validateCohort = require('../validation/cohortValidation');
const Joi = require('joi');


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

module.exports.getCohorts = async (req, res) => {
  let cohorts = {};

  try {
    cohorts = await Cohort.findAll({});
    res.status(200).json(cohorts);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createCohort = async (req, res) => {
  const data = req.body;
  const { cohortName, startDate, endDate, levels } = data; // Extract the cohort and levels from the request

  const transaction = await sequelize.transaction(); // Start a new transaction

  try {
    // Create the cohort first
    const createCohort = await Cohort.create(
      {
        cohortName,
        startDate,
        endDate
      },
      { transaction } // Pass the transaction
    );

    const cohortId = createCohort.uuid; // Assuming the cohort has a UUID

    // Now loop through the levels and create them, associating them with the cohort
    for (const level of levels) {
      const {
        levelName,
        startDate: levelStartDate,
        endDate: levelEndDate,
        exam_dates,
        exam_quotation_number,
        facilitators
      } = level;

      const levelData = {
        levelName,
        startDate: levelStartDate,
        endDate: levelEndDate,
        cohortId,
        exam_dates,
        exam_quotation_number
      };

      // Create the level and associate it with the cohort
      const createLevel = await Level.create(levelData, { transaction });

      const levelId = createLevel.uuid; // Assuming the level has a UUID

      // Loop through facilitators and associate them with the level
      for (const facilitator of facilitators) {
        await LevelFacilitators.create({
          levelId,
          facilitatorId: facilitator.value, // Assuming `value` is the facilitator ID
          specification: facilitator.role // Assuming `role` is the facilitator role
        }, { transaction }); // Pass the transaction
      }
    }

    await transaction.commit(); // Commit the transaction if all operations are successful
    res.status(201).json({ message: "Cohort and levels created successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).json({ error: error.message });
  }
};



module.exports.getCohortById = async (req, res) => {
  const { error, value: id } = uuidSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }

  try {
    // Fetch cohort details
    const cohort = await Cohort.findOne({ where: { uuid: id } });

    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Fetch levels associated with the cohort
    const levels = await Level.findAll({ where: { cohortId: cohort.uuid } });

    // Prepare cohort data
    const cohortData = {
      id: cohort.id,
      uuid: cohort.uuid,
      cohortName: cohort.cohortName,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      createdAt: cohort.createdAt,
      updatedAt: cohort.updatedAt,
    };

    let levelData = [];
    
    if (levels.length > 0) {
      levelData = await Promise.all(
        levels.map(async (level) => {
          const students = await StudentLevels.findAll({ where: { levelId: level.uuid } });
          const studentUuids = students.map((student) => student.studentId);
          const studentsInfo = await Student.findAll({ where: { uuid: studentUuids } });

          const facilitators = await LevelFacilitators.findAll({ where: { levelId: level.uuid } });
          const facilitatorUuids = facilitators.map((facilitator) => facilitator.facilitatorId);
          const facilitatorInfo = await Facilitator.findAll({ where: { uuid: facilitatorUuids } });

          return {
            id: level.id,
            uuid: level.uuid,
            levelName: level.levelName,
            startDate: level.startDate,
            endDate: level.endDate,
            exam_dates: level.exam_dates,
            exam_quotation_number: level.exam_quotation_number,
            createdAt: level.createdAt,
            updatedAt: level.updatedAt,
            cohortId: level.cohortId,
            students: studentsInfo,
            facilitators: facilitatorInfo,
          };
        })
      );
    }
    console.log(levelData)
    // Return cohort data with levels (if found) or an empty levels array
    res.status(200).json({
      cohort: cohortData,
      levels: levelData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// module.exports.getCohortById = async (req, res) => {
//   const { error, value: id } = uuidSchema.validate(req.params.id);

//   if (error) {
//     return res.status(400).json({ message: "Invalid UUID format" });
//   }
//   try {
//     const cohort = await Cohort.findOne({ where: { uuid: id } });

//     if (!cohort) {
//       return res.status(404).json({ message: 'Cohort not found' });
//     }

//     const levels = await Level.findAll({ where: { cohortId: cohort.uuid } });

//     if (levels.length === 0) {
//       return res.status(404).json({ message: 'No levels found for this cohort' });
//     }

//     const cohortData = await Promise.all(
//       levels.map(async (level) => {
//         const levelData = {
//           id: level.id,
//           uuid: level.uuid,
//           levelName: level.levelName,
//           startDate: level.startDate,
//           endDate: level.endDate,
//           exam_dates:level.exam_dates,
//           exam_quotation_number:level.exam_quotation_number,
//           createdAt: level.createdAt,
//           updatedAt: level.updatedAt,
//           cohortId: level.cohortId,
//           students: [],
//           facilitators: [],
//         };

//         const students = await StudentLevels.findAll({ where: { levelId: level.uuid } });
//         const studentUuids = students.map((student) => student.studentId);
//         const studentsInfo = await Student.findAll({ where: { uuid: studentUuids } });

//         const facilitators = await LevelFacilitators.findAll({ where: { levelId: level.uuid } });
//         const facilitatorUuids = facilitators.map((facilitator) => facilitator.facilitatorId);
//         const facilitatorInfo = await Facilitator.findAll({ where: { uuid: facilitatorUuids } });

//         levelData.students = studentsInfo;
//         levelData.facilitators = facilitatorInfo;

//         return levelData;
//       })
//     );

//     const response = {
//       cohorts: {
//         id: cohort.id,
//         uuid: cohort.uuid,
//         cohortName: cohort.cohortName,
//         startDate: cohort.startDate,
//         endDate: cohort.endDate,
//         createdAt: cohort.createdAt,
//         updatedAt: cohort.updatedAt,
//       },
//       levels: cohortData,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };



module.exports.updateCohort = async (req, res) => {
  const { error: uuidError, value: id } = uuidSchema.validate(req.params.id);

  if (uuidError) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }

  const { error, value } = validateCohort(req.body);

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
    const cohort = await Cohort.findOne({ where: { uuid: id } });

    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    const [updatedRows] = await Cohort.update(value, { where: { uuid: id } });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "Cohort not updated" });
    }

    const updatedCohort = await Cohort.findOne({ where: { uuid: id } });
    res.status(200).json({ message: "Cohort updated successfully", cohort: updatedCohort });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.deleteCohort = async (req, res) => {
  const { error, value: id } = uuidSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }

  try {
    const deletedRows = await Cohort.destroy({ where: { uuid: id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    res.status(200).json({ message: "Cohort successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};