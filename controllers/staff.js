const {Staff, Leave} = require('../models');
const models = require('../models')
const validateStaff = require('../validation/staffValidation'); 
const Joi = require('joi');


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

module.exports.getStaff = async (req, res) =>{

    try{
    const staffs = await Staff.findAll({order: [['createdAt', 'DESC']]})
     res.status(200).json(staffs)
    
}catch(error){
    res.status(500).json({error:error.message})
}

}
module.exports.createStaff = async (req, res) => {
  const { error } = validateStaff(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(err => err.message) });
  }

  const staff = req.body;
  try {
    const createStaff = await Staff.create(staff);
    res.status(201).json(createStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getStaffById = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findOne({
      where: { uuid: id },
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const leaveDaysTaken = await Leave.findAll({ where: { staffUUID: id } });

    // If leaveDaysTaken is null or undefined, set it to an empty array
    const leaveDaysArray = leaveDaysTaken ? leaveDaysTaken.map(leave => leave.get()) : [];

    const staffWithLeaveDays = {
      ...staff.get(), // Use get() to get the plain object from Sequelize instance
      leaveDaysTaken: leaveDaysArray, // Ensure this is always an array
    };

    res.status(200).json(staffWithLeaveDays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 module.exports.updateStaff = async (req, res) => {
    const { id} = req.params
    const {firstName, lastName, email,idNo,  phone ,role, project , leaveDays} = req.body

    try{
      const staff = await Staff.findOne({where: {uuid: id}});
      const updatestaff = await staff.update(
        {
        firstName: firstName || staff.firstName,
        lastName: lastName || staff.lastName,
        email: email || staff.email,
        phone: phone || staff.phone,
        idNo: idNo || staff.idNo,
        role: role || staff.role,
        project: project || staff.project,
        leaveDays: leaveDays || staff.leaveDays 


        },
        {
          where: {uuid: id}

      })
      if(!updatestaff){
        res.status(400).json({message: "Bad request.Try again later"})
      }
      console.log(staff)

      res.status(200).json({message: "Staff information successfully updated"})
    }
  catch(error){
    res.status(500).json({error:error.message})
  }
}

module.exports.addLeaveDays = async (req, res) => {
  const staffUUID = req.params.id;
  const { day } = req.body; 

  try {
    const leaveRecord = await Leave.create({ staffUUID, day });

    const staff = await Staff.findOne({ where: { uuid: staffUUID } });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    staff.leaveDays -= 1;

    await staff.save();

    res.status(200).json({ message: 'Leave day added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteStaff = async(req, res)=>{
  const {id} = req.params

  try{
    const staff = await Staff.findOne({where: {uuid :id}})
    if(staff){
      const deleteStaff  = await Staff.destroy({where: {uuid :id}})
      if(deleteStaff){
        res.status(200).json({message: "staff record succcessfully deleted"})
      }

    }

  }catch(errror){
    res.status(500).json({error: error.message})
  }

}
