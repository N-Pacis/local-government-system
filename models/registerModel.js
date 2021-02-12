const mongoose = require('mongoose');
const Joi = require('joi');

function validateRegistration(registration){
    const schema = {
        username:Joi.string().min(3).max(100).required(),
        email:Joi.string().min(10).max(255).required(),
        password:Joi.string().min(5).max(255).required(),
        phoneNumber:Joi.number().required(),
        isAdmin:Joi.boolean().required()
    }
    return Joi.validate(registration,schema)
}
const registerSchema = new mongoose.Schema({
    username:{
        type:String,
        minLength:3,
        maxLength:100,
        unique:true,
        lowercase:true,
        required:true
    },
    email:{
        type:String,
        minLength:7,
        maxLength:255,
        unique:true,
        required:true
    },
    password:{
        type:String,
        minLength:5,
        maxLength:255,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
})

const Register = mongoose.model('registration',registerSchema)

module.exports.Register = Register
module.exports.validate = validateRegistration