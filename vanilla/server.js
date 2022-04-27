
const { json } = require("express");
const express = require("express")
const app = express()
const path = require("path");
const { env } = require("process");
require("dotenv").config()

/////config
app.use(express.json())
// require("ejs")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
let mongodb = require("mongodb").MongoClient  ///mongodb atlas

////sending pages; 
///setting public dirs
app.use(express.static("public"))
// app.use("/home",express.static("./home"))
// app.use("/profile",express.static("./profile"))

///home page route
let container = [1, 2, 3]
app.get("/home", (req, res)=>{
    res.render("home.ejs", {container})
})
///profile page route
app.get("/profile", (req, res)=>{
    res.render("profile.ejs")
})





////registering routes
app.post("/regUser", (req, res)=>{
    console.log(".....post regUser........")
    console.log(req.body)

    ////call mongodb
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()

        let dbusers = await dbb.collection("users").find({}).toArray()
        console.log(dbusers)

        if(await dbb.collection("users").findOne({em: req.body.em})){
            console.log("exist")
        }else{
            console.log("doesnt exist")
            dbb.collection("users").insertOne(req.body)
        }
        // dbb.collection("users").insertOne(req.body)
        })
})







const port = 4000 || env.process.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

