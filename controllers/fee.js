const {Fee} = require('../models')
// const models = require('../models')
// console.log(models)

module.exports.getFees = async (req, res)=>{
    try{
        const levelsFees = await Fee.findAll()
        res.status(200).json(levelsFees)

    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports.createLevelFees = async (req, res)=>{
    try{
        const createFees = await Fee.create(req.body)

        res.status(201).json("Levels fee created")

    }catch(error){
        res.status(500).json(error.message)
    }
}