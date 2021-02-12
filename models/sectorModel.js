const mongoose = require("mongoose")
const Joi = require("joi")

function validateSector(sector) {
    const schema = {
        districtId:Joi.objectId(),
        sectorName:Joi.string().min(2).max(255).required(),
        ExecutiveOfficer:Joi.string().min(3).max(255).required()
    }
    return Joi.validate(sector,schema)
}
const sectorSchema= new mongoose.Schema({
    districtInfo:{
        type:{
            provinceName:{
                type:String,
                minLength:2,
                maxLength:255,
                required:true
            }
        }
    },
    sectorName:{
        type:String,
        minLength:2,
        maxLength:255,
        required:true
    },
    ExecutiveOfficer:{
        type:String,
        minLength:3,
        maxLength:255
    }                                                                         
})

const Sector = mongoose.model('sector', sectorSchema)  

module.exports.Sector = Sector
module.exports.validate = validateSector