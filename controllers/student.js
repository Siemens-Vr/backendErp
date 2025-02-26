const {Student, StudentLevels, Cohort, Level, Fee} = require('../models');
const { sequelize } = require('../models'); 


const Joi = require('joi')
const { Op } = require('sequelize');
const validateStudent = require('../validation/studentsValidation');


const schema = Joi.object({

  email: Joi.string().email().required(),

})


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });


module.exports.getStudents = async (req, res) =>{
 
  const name = req.query.q;
  const pageAsNumber = Number.parseInt(req.query.page);
  // console.log(pageAsNumber)

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber> 0 ){
    page = pageAsNumber;
  }

  console.log(page)
  let size = 10;

  try {
    if (name) {
      const students = await Student.findAndCountAll({
        where: {
          regNo: {
            [Op.iLike]: `%${name}%`  // Use Op.iLike for case-insensitive search
          }
        }
      });
      // console.log(students)
      res.status(200).json({
        content :students.rows,
        count: students.count});
    } else {
      const students = await Student.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: page * size

      });
      res.status(200).json({
        content :students.rows,
        count: students.count,
        totalPages: Math.ceil( students.count  / size)

      });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  }

module.exports.createStudent = async (req, res) => {
  console.log(req.body);

  try {
    await sequelize.transaction(async (t) => {
      // Create the student
      const student = await Student.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        kcseNo: req.body.kcseNo,
        regNo: req.body.regNo,
      }, { transaction: t });

      // Loop through the cohortLevels array to add multiple levels and cohorts
      for (const level of req.body.cohortLevels) {
        await StudentLevels.create({
          studentId: student.uuid,
          levelId: level.levelUuid,  // Assuming the level ID is provided
          cohortId: level.cohortUuid, // Cohort ID from the request
          fee: level.fee,  // Fee associated with the level
          examResults: level.examResults,  // Exam results for the level
        }, { transaction: t });
      }

      res.status(201).json({ message: 'Student created successfully', student });
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Failed to create student', error });
  }
};

module.exports.addStudentLevel = async (req, res) => {
  console.log(req.body);

  const studentLevels = req.body;

  try {
    // Loop through each student level object in the request body
    for (let studentLevel of studentLevels) {
      const { studentUuid, levelUuid, cohortUuid, fee, examResults } = studentLevel;

      // Create each StudentLevel entry
      await StudentLevels.create({
        studentId: studentUuid,
        levelId: levelUuid,
        cohortId: cohortUuid,
        fee,
        examResults
      });
    }

    res.status(200).json({ message: "Student levels created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateStudentLevel = async (req, res) => {
  const uuid = req.params.id; // Get the UUID of the student level
  const { fee, examResults } = req.body; // Extract fee and examResults from the request body

  try {
    // Find the record in the StudentLevels table by its UUID
    const studentLevel = await StudentLevels.findOne({ where: { uuid } });

    if (!studentLevel) {
      return res.status(404).json({ error: 'Student level not found' });
    }

    // Update the student level with the new fee and examResults
    await studentLevel.update({
      fee: fee || studentLevel.fee, // Only update if new fee is provided
      examResults: examResults || studentLevel.examResults, // Only update if new examResults are provided
    });

    // Send the updated record back as the response
    res.status(200).json(studentLevel);
  } catch (error) {
    console.error('Error updating student level:', error);
    res.status(500).json({ error: 'Failed to update student level' });
  }
};


module.exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the student along with their associated levels and cohorts
    const student = await Student.findOne({
      where: { uuid: id },
      include: [
        {
          model: Level, // Include the Level model
          as: 'levels', // Alias for the relationship
          through: {
            attributes: ['uuid','fee', 'examResults'], // Get fee and amountPaid from StudentLevel
          },
          include: [
            {
              model: Cohort, // Include Cohort details
            },
          ],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch all fees to later match with the levels by levelName
    const fees = await Fee.findAll();

    // Process the student levels, finding matching fees by levelName
    const levelsWithFees = student.levels.map(level => {
      // Find the corresponding fee by matching levelName
      const fee = fees.find(feeRecord => feeRecord.levelName === level.levelName);
      const feeAmount = fee ? fee.amount : 0; // Get the fee amount if found, otherwise 0
      const amountPaid = level.StudentLevels?.fee || 0; // Get the amount paid from StudentLevel

      // Calculate balance and determine fee status
      const balance = feeAmount - amountPaid;
      const feeStatus = balance > 0 ? 'pending' : 'paid';

      return {
        ...level.toJSON(), // Spread the level data
        StudentLevel: level.StudentLevel, // Include StudentLevel data such as fee and amountPaid
        feeAmount, // Add the calculated fee amount
        amountPaid, // Add the amount paid
        balance, // Add the balance
        feeStatus, // Add the fee status (pending or paid)
      };
    });

    // Respond with the processed student data including levels with fees and other data
    res.status(200).json({
      ...student.toJSON(), // Spread student data
      levels: levelsWithFees, // Replace levels with the enriched data containing fees and balance
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports.search = async (req, res) => {
    const {  idNo, name } = req.body;
    console.log(regNo, idNo, name);
    let students = null;
    try {
      if (regNo) {
        students = await Staff.findAll({
          where: {
            regNo
          },
        });
      } else if (id) {
        students = await Student.findAll({
          where: {
            idNo
          },
        });
      } else if (name) {
        students = await Student.findAll({
          where: {
            name: { [Op.like]: `%${name}%` },
          },
        });
      }
  
      if (!students || students.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports.updateStudent = async (req, res) => {
    const { id} = req.params
    const {firstName, lastName, email, phone ,feePayment } = req.body

    try{
      const student = await Student.findOne({where: {uuid: id}});
      // res.json(student)
      const updateStudent = await Student.update(
        {
        firstName: firstName || student.firstName,
        lastName: lastName || student.lastName,
        email: email || student.email,
        phone: phone || student.phone,
        feePayment: feePayment || student.feePayment 
        },
        {
          where: {uuid: id}

      })
      if(!updateStudent){
        res.status(400).json({message: "Bad request.Try again later"})
      }

      res.status(200).json({message: "Student information successfully updated"})
    }
  catch(error){
    res.status(500).json({error:error.message})
  }
}

module.exports.deleteStudent = async(req, res)=>{
  const {id} = req.params

  try{

      const deleteStudent  = await Student.destroy({where: {uuid :id}})
      if(deleteStudent){
        res.status(200).json({message: "Student record succcessfully deleted"})
      }

    

  }catch(errror){
    res.status(500).json({error: error.message})
  }

}