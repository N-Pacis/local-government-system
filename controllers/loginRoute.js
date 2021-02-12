const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require("jsonwebtoken")
const config = require('config');
const {Register} = require("../models/registerModel")
const _= require("lodash")
const router = express.Router();

router.post("/login",async(req,res)=>{
    try{
        const {error} = await validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const user = await Register.findOne({username:req.body.username})
        if(!user) return res.status(400).send("Invalid username or password")
        //@ts-ignore
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword) return res.status(400).send("Invalid username or password")
        //@ts-ignore
        const token = jwt.sign({_id:user._id,username:user.username,email:user.email,password:user.password,phoneNumber:user.phoneNumber,isAdmin:user.isAdmin},config.get("jwtPrivateKey"))
        res.header('x-auth-token',token).send(_.pick(user,["username","email","phoneNumber"]))
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

function validate(login){
   const schema = {
    username:Joi.string().lowercase().min(3).max(100).required(),
    password:Joi.string().min(5).max(255).required()
   }
   return Joi.validate(login,schema)  
}

module.exports = router