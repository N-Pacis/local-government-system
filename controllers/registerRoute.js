const express= require('express');
const router= express.Router();
const {Register,validate} = require("../models/registerModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const config = require("config")

router.post("/register",async(req,res)=>{
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const usernameIsRegistered = await Register.find({username:req.body.username})
    if(usernameIsRegistered==[]) return res.status(400).send("Username alteady taken")
    const email = await Register.find({email:req.body.email})
    if(email==[]) return res.status(400).send("Email already taken")
    const newUser = new Register({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        phoneNumber:req.body.phoneNumber,
        isAdmin:req.body.isAdmin
    })
    const salt = await bcrypt.genSalt(10);
    //@ts-ignore
    newUser.password = await bcrypt.hash(newUser.password,salt)
    try{
        await newUser.save()
        //@ts-ignore
        const token = jwt.sign({_id:newUser._id,username:newUser.username,email:newUser.email,password:newUser.password,phoneNumber:newUser.phoneNumber,isAdmin:newUser.isAdmin},config.get("jwtPrivateKey"))
        res.header('x-auth-token',token).send(_.pick(newUser,['_id','username','email','phoneNumber']))
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

module.exports = router