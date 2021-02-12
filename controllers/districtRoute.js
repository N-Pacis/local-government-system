const express = require('express')
const router = express.Router()
const {District,validate} = require('../models/districtModel')
const {Province} = require("../models/provinceModel")
const {auth} = require("../middlewares/authenticated")
const {admin} = require("../middlewares/admin")


router.get("/districts",auth,async(req,res)=>{
    try{
        const districts = await District.find()
        res.send(districts)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.get("/district/:id",auth,async(req,res)=>{
    const district = await District.findById(req.params.id)
    if(!district) return res.status(404).send("Unable to find the district with the given id")
    res.send(district)
})

router.post("/new/district",[auth,admin],async(req,res)=>{
    if(!req.body.provinceId) return res.status(400).send("province Id is required!")
    const province = await Province.findById(req.body.provinceId)
    if(!province) return res.status(404).send("Unable to find the province with the given id")
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const newDistrict = new District({
        provinceInfo:{
            //@ts-ignore
            id:province._id,
            //@ts-ignore
            Name: province.provinceName
        },
        districtName:req.body.districtName,
        Mayor:req.body.Mayor
    })
    try{
        await newDistrict.save()
        res.send(newDistrict)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

router.put("/edit/district/:id",[auth,admin],async(req,res)=>{
   const district = await District.findById(req.params.id)
   if(!district) return res.status(400).send("Unable to find the district with the given id")
   const {error} = validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   try{
       const updatedDistrict = await District.findByIdAndUpdate(req.params.id,{
            districtName:req.body.districtName,
            Mayor:req.body.Mayor
       },{new:true})
       res.send(updatedDistrict)
   }
   catch(ex){
       res.status(400).send(ex.message)
   }
})

router.delete("/delete/district/:id",[auth,admin],async(req,res)=>{
    const district = await District.findById(req.params.id)
    if(!district) return res.status(400).send("Unable to find the district with the given id")
    try{
        const deletedDistrict = await District.findByIdAndDelete(req.params.id)
        res.send(deletedDistrict)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

module.exports = router;