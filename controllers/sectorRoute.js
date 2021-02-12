const express = require('express')
const router = express.Router()
const {Sector,validate} = require('../models/sectorModel')
const {District} = require("../models/districtModel")
const {auth} = require("../middlewares/authenticated")
const {admin} = require("../middlewares/admin")

router.get("/sectors",auth,async(req,res)=>{
    try{
        const sectors = await Sector.find()
        res.send(sectors)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.get("/sector/:id",auth,async(req,res)=>{
    const sector = await Sector.findById(req.params.id)
    if(!sector) return res.status(404).send("Unable to find the sector with the given id")
    res.send(sector)
})

router.post("/new/sector",[auth,admin],async(req,res)=>{
    if(!req.body.districtId) return res.status(400).send("district Id is required!")
    const district = await District.findById(req.body.districtId)
    if(!district) return res.status(404).send("Unable to find the district with the given id")
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const newsector = new Sector({
        districtInfo:{
            //@ts-ignore
            id:district._id,
            //@ts-ignore
            Name: district.districtName
        },
        sectorName:req.body.sectorName,
        ExecutiveOfficer:req.body.ExecutiveOfficer
    })
    try{
        await newsector.save()
        res.send(newsector)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

router.put("/edit/sector/:id",[auth,admin],async(req,res)=>{
   const sector = await Sector.findById(req.params.id)
   if(!sector) return res.status(400).send("Unable to find the sector with the given id")
   const {error} = validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   try{
       const updatedsector = await Sector.findByIdAndUpdate(req.params.id,{
            sectorName:req.body.sectorName,
            Mayor:req.body.Mayor
       },{new:true})
       res.send(updatedsector)
   }
   catch(ex){
       res.status(400).send(ex.message)
   }
})

router.delete("/delete/sector/:id",[auth,admin],async(req,res)=>{
    const sector = await Sector.findById(req.params.id)
    if(!sector) return res.status(400).send("Unable to find the sector with the given id")
    try{
        const deletedsector = await Sector.findByIdAndDelete(req.params.id)
        res.send(deletedsector)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

module.exports = router;