const express = require('express')
const {Country,validate} = require("../models/countryModel")
const router = express.Router();

router.get('/countries',async(req,res)=>{
    try{
        const countries = await Country.find();
        res.send(countries);
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

router.get("/country/:id",async(req,res)=>{
    try{
        const country = await Country.findById(req.params.id);
        if(!country) return res.status(404).send("Unable to find the country with the given id")
        res.send(country);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }
})

router.post("/new/country",async(req,res)=>{
    const isRegistered = Country.find({countryCode:req.body.countryCode})
    if(isRegistered) return res.status(400).send("Country Code already registered")
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const newCountry = new Country({
        countryCode:req.body.countryCode,
        countryName:req.body.countryName,
        countrySize:req.body.countrySize
    })
    try{
        newCountry.save()
        res.send(newCountry)
    }
    catch(ex){
        res.status(400).send(ex.message)
    }
})

router.put("/edit/country/:id",async(req,res)=>{
    const country = Country.findById(req.params.id)
    if(!country) return res.status(404).send("Unable to find the country with the given id");
    const isRegistered = Country.find({countryCode:req.body.countryCode})
    if(isRegistered) return res.status(400).send("Country Code already registered")
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    try{
        const updateCountry = await Country.findByIdAndUpdate(req.params.id,{
            countryCode:req.body.countryCode,
            countryName:req.body.countryName,
            countrySize:req.body.countrySize
        },{new:true})
        res.send(updateCountry)
    }
    catch(ex){
        res.status(404).send(ex.message)
    }
})

router.delete("/delete/country/:id",async(req,res)=>{
    const country = Country.findById(req.params.id)
    if(!country) return res.status(404).send("Unable to find the country with the given id");
    try{
        const deletedCountry = await Country.findByIdAndDelete(req.params.id)
        res.send(deletedCountry);
    }
    catch(ex){
        res.status(400).send(ex.message);
    }
})

module.exports = router