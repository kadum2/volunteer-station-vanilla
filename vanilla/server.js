
const { json } = require("express");
const express = require("express")
const app = express()
const path = require("path");
// const env = require("dotenv")
const { env } = require("process");
require("dotenv").config()
let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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





////registering routes;
// app.post("/regUser", (req, res)=>{
//     console.log(".....post regUser........")
//     console.log(req.body)

//     ////call mongodb
//     mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//         let dbb = client.db()

//         let dbusers = await dbb.collection("users").find({}).toArray()
//         console.log(dbusers)

//         ///check if user exist
//         if(await dbb.collection("users").findOne({em: req.body.em})){
//             console.log("exist")

//             res.json(req.body)
//         }else{
//             console.log("doesnt exist")
//             dbb.collection("users").insertOne(req.body)

//             res.json(req.body)  ////sent the stored db one???
//         }
//         // dbb.collection("users").insertOne(req.body)
//         })
// })



////registering routes; encrypt


app.post("/regUser", async (req, res)=>{
    console.log(".....post regUser........")
    console.log(req.body)

try{

    ///check if exist in db; by em
    ////call mongodb
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        if(await dbb.collection("users").findOne({em: req.body.em})){
            console.log(await dbb.collection("users").findOne({em: req.body.em}))
            console.log("user does exist")
            res.json({status: 'user does exist'})
        }else{
            console.log("user doestn exist; register a new one")

    ///encrypt the pw; 
    const hashedPassword = await bcrypt.hash(req.body.pw, 10)
    const user = {em: req.body.em, pw: hashedPassword}
    let newUser = await dbb.collection("users").insertOne(user) ///to get the id in db

        ////jwt; make token
        let token = jwt.sign(user, process.env.TOKEN)


    res.status(201).send(user)
    ///or 
    // res.json({user: newUser})
        }
        })
}catch{
    res.status(500).send()
}
})


////login

app.post("/loginUser", async (req, res)=>{
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        ///check if exist
        let found = await dbb.collection("users").findOne({em: req.body.em})
        if(found){
            if(await bcrypt.compare(req.body.pw, found.pw)){
                console.log("correct cred; login")
                res.send(found)
            }else{
                console.log("not correct cred")
                res.json("r u hacker")
            }
        }else{
            res.status(402).send("no user found")
        }

    })
})



////authenticate token middleware; 

function authToken(req, res, next){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    ///check if exist
    if(token == null)return res.status(401).send("no token sent")

    ///verify
    jwt.verify(token, env.process.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.user = data
        next()
    })
}


const port = 4000 || env.process.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

