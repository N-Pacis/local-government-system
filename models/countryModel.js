const mongoose = require('mongoose');
const Joi = require('joi');

function validateCountry(country){
    const schema={
        countryCode:Joi.number().min(1).required(),
        countryName:Joi.string().min(2).max(50).required(),
        countrySize:Joi.string().min(0).max(7).required()
    }
    return Joi.validate(country,schema)
}
const countrySchema = new mongoose.Schema({
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
    },
    countrySize:{
        type:String,
        minlength:0,
        maxlength:15,
        required:true
    }
})
const Country = mongoose.model('countries',countrySchema)

module.exports.countrySchema = countrySchema
module.exports.Country = Country;
module.exports.validate = validateCountry;