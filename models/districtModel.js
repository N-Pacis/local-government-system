const mongoose = require("mongoose")
const Joi = require("joi")

function validateDistrict(district) {
    const schema = {
        provinceId:Joi.objectId(),
        districtName:Joi.string().min(2).max(255).required(),
        Mayor:Joi.string().min(3).max(255).required()
    }
    return Joi.validate(district,schema)
}
const districtSchema= new mongoose.Schema({
    provinceInfo:{
        type:{
            provinceName:{
                type:String,
                minLength:2,
                maxLength:255,
                required:true
            }
        }
    },
    districtName:{
        type:String,
        minLength:2,
        maxLength:255,
        required:true
    },
    Mayor:{
        type:String,
        minLength:3,
        maxLength:255
    }                                                                         
})

const District = mongoose.model('district', districtSchema)  

module.exports.District = District
module.exports.validate = validateDistrict