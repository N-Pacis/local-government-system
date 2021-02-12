const express= require('express')
const {Province,validate} = require("../models/provinceModel")
const {Country} = require("../models/countryModel")
const {auth} = require("../middlewares/authenticated")
const {admin} = require("../middlewares/admin")
const router = express.Router()


router.get("/provinces",auth,async(req,res)=>{
    try{
        const provinces = await Province.find()
        res.send(provinces)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.get("/province/:id",auth,async(req,res)=>{
    try{
        const province = await Province.findById(req.params.id)
        if(!province) return res.status(404).send("Unable to find the province with the given id")
        res.send(province)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.post("/new/province",[auth,admin],async(req,res)=>{
    if(!req.body.countryId) return res.status(400).send("countryId is required")
    const country = await Country.findById(req.body.countryId)
    if(!country) return res.status(404).send("Unable to find the country with the given countryId")
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const newProvince = new Province({
        country:{
            //@ts-ignore
           countryCode:country.countryCode,
           //@ts-ignore
           countryName:country.countryName
        },
        provinceName:req.body.provinceName,
        provinceSize:req.body.provinceSize
    })
    try{
        await newProvince.save()
        res.send(newProvince)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

router.put("/edit/province/:id",[auth,admin],async(req,res)=>{
    const{error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const province = await Province.findById(req.params.id)
    if(!province) return res.status(404).send("Unable to find the province with the given id")
    try{
        const updatedProvince = await Province.findByIdAndUpdate(req.params.id,{
        provinceName:req.body.provinceName,
        provinceSize:req.body.provinceSize
        },{new:true})
       res.send(updatedProvince)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.delete("/delete/province/:id",[auth,admin],async(req,res)=>{
    const province = await Province.findById(req.params.id)
    if(!province) return res.status(404).send("Unable to find the province with the given id")
    try{
        const deletedProvince = await Province.findByIdAndDelete(req.params.id)
        res.send(deletedProvince)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

module.exports=router;