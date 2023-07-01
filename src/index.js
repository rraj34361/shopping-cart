const express = require("express");
const routes = require("./routes/routes")

const server = express();

server.use(express.json());

server.use("/",routes);

server.listen(3000,()=>{
    console.log("server started on port 3000")
})