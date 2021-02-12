const express= require('express');
const app = express();
const Joi = require("joi")
Joi.objectId=require("joi-objectid")(Joi)
const config = require('config');
const mongoose = require('mongoose');
const startupdebug = require("debug")("app:startup")
app.use(express.json())

app.use(require("./controllers/countryRoute"));
app.use(require("./controllers/provinceRoute"));
app.use(require("./controllers/districtRoute"));
app.use(require("./controllers/sectorRoute"));
app.use(require("./controllers/registerRoute"));
app.use(require("./controllers/loginRoute"));

mongoose.connect("mongodb://localhost/LocalGovernmentSystem",{useUnifiedTopology:true,useNewUrlParser:true})
  .then(()=>{
      console.log("Connected successfully....");
  })
  .catch(err=>{
      console.log("Failed to connect due to ",err);
  })

if(!config.get("jwtPrivateKey")){
    console.error("FATAL ERROR:jwtPrivateKey is not defined")
    process.exit(-1);
}
if(!config.get("PORT")){
    console.error("FATAL ERROR:Port is not defined")
    process.exit(-1);
}
const port =config.get("PORT");
// console.log(startupdebug)
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})