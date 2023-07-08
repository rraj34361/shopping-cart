const express = require("express");
const routes = require("./routes/routes")
const multer  = require('multer')
const mongoose = require('mongoose')
require('dotenv').config()
const {MONGOURL} = process.env
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended : true}))
server.use(multer().any())
mongoose.connect(MONGOURL, {
    useNewUrlParser : true
}).then(()=>{
    console.log('mongoDb is connected')
}).catch((err)=> console.log(err.message))
 

server.use("/",routes);

server.listen(3000,()=>{
    console.log("server started on port 3000")
})