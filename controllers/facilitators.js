const {Facilitator, HoursWorked} = require('../models');
const { Op } = require('sequelize');
const validateFacilitator = require('../validation/facilitatorValidation');
const Joi = require('joi');
// const facilitator = require('../models/facilitator');

const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

module.exports.getFacilitators = async (req, res) =>{
    const name = req.query.q
    if (name){
      try{
        const facilitators= await Facilitator.findAll({
          where: {
            firstName: {
              [Op.iLike]: `%${name}%`  // Use Op.iLike for case-insensitive search
            }
          }
        });
        if (!facilitators || facilitators.length === 0) {
          res.status(200).json({ message: 'No facilitators found yet' });
        } else {
          res.status(200).json(facilitators);
        }  
      }
      catch(e){
        console.log(e)
      }
    }else{
    try{
      const facilitators = await Facilitator.findAll({order: [['createdAt', 'DESC']]})
      if (!facilitators || facilitators.length === 0) {
        res.status(200).json({ message: 'No facilitators found yet' });
      } else {
        res.status(200).json(facilitators);
      }  
    }catch(error){
      res.status(500).json({error:error.message})
          }}
}

module.exports.createFacilitator = async (req, res) => {
  const { error } = validateFacilitator(req.body);
  if (error) {
      return res.status(400).json({ error: error.details.map(err => err.message) });
  }

  try {
      const createFacilitator = await Facilitator.create(req.body);
      res.status(201).json(createFacilitator);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports.getFacilitatorById = async (req, res)=>{
    const {id} = req.params
    try{
      const facilitator =await Facilitator.findOne({where: {uuid : id}})
      if (!facilitator){
        res.status(404).json({message: 'facilitator not found'})
      }
      res.status(200).json(facilitator)

    }catch(error){
      res.status(500).json({error:error.message})
    }
    
}
module.exports.search = async (req, res) => {

    const { idNo, name } = req.body;
    let facilitator = null;
    try {
      if (idNo) {
        facilitator = await Facilitator.findAll({
          where: {
            idNo
          },
        });
      } else if (id) {
        facilitator = await Facilitator.findAll({
          where: {
            idNo
          },
        });
      } else if (name) {
        facilitator = await Facilitator.findAll({
          where: {
            name: { [Op.like]: `%${name}%` },
          },
        });
      }
  
      if (!facilitator || facilitator.length === 0) {
        return res.status(404).json({ error: 'facilitator not found' });
      }
  
      res.status(200).json(facilitator);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports.updateFacilitator = async (req, res) => {
    const { id } = req.params;
    const { error } = validateFacilitator(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }

    try {
        const facilitator = await Facilitator.findOne({ where: { uuid: id } });
        if (!facilitator) {
            return res.status(404).json({ message: 'Facilitator not found' });
        }

        const updatedFacilitator = await Facilitator.update(req.body, {
            where: { uuid: id }
        });

        if (!updatedFacilitator) {
            return res.status(400).json({ message: "Bad request. Try again later." });
        }

        res.status(200).json({ message: "Facilitator information successfully updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports.deleteFacilitator = async(req, res)=>{
  const {id} = req.params

  try{
    
      const deleteFacilitator  = await Facilitator.destroy({where: {uuid :id}})
      if(deleteFacilitator){
        res.status(200).json({message: "facilitator record succcessfully deleted"})
      }
    
  }catch(errror){
    res.status(500).json({error: error.message})
  }

}
