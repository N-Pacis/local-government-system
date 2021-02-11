const mongoose = require('mongoose');
const Joi = require('joi');

function validateProvince(province){
    const schema = {
        countryId:Joi.objectId(),
        provinceName:Joi.string().min(2).max(255).required(),
        provinceSize:Joi.string().min(2).max(15).required()
    }
    return Joi.validate(province,schema)
}
const provinceSchema= new mongoose.Schema({
    country:{
        type:{
            countryCode:{
                type:Number,
                required:true,
                min:1,
                unique:true
            },
            countryName:{
                type:String,
                minlength:2,
                maxlength:50,
                required:true,
            }
        }
    },
    provinceName:{
        type:String,
        minLength:2,
        maxLength:255,
        required:true
    },
    provinceSize:{
        type:String,
        minLength:2,
        maxLength:15,
        required:true
    }
})
const Province = mongoose.model('province',provinceSchema);

module.exports.validate = validateProvince;
module.exports.Province = Province;