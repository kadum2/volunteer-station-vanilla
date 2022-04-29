
const express = require("express")
const app = express()
const path = require("path");
const { json } = require("express");
let cookieParser = require("cookie-parser")
const env = require("dotenv")
env.config()
let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
let mongodb = require("mongodb").MongoClient  ///mongodb atlas

/////config
app.use(express.json())
// require("ejs")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

////sending pages; 
///setting public dirs
// app.use(express.static("public"))
// app.use("/home",express.static("./home"))
// app.use("/profile",express.static("./profile"))

///setting pages; 
app.use("/home", express.static("./home"))
app.use("/profile", express.static("./profile"))


//cookie temaplate; token, currentUserData, userData



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
        let token = jwt.sign(user.em, process.env.TOKEN)

        ///send data and token
        res.json({user: {em: user.em, name: user.name}, token: token})
        // res.status(201).send(user)
        ///or 
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
                // res.send(found)
                ////jwt; make token
                let token = jwt.sign(found.em, process.env.TOKEN)

                ///send data and token
                res.json({user: {em: found.em, name: found.name}, token: token})

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
///may make it a function to be used at the middle of routes function 

function authToken(req, res, next){
    const authHeader = req.headers["authorization"]
    console.log(authHeader)
    // const token = authHeader && authHeader.split(" ")[1]
    const token = authHeader.split(" ")[1]

    console.log(token)
    ///check if exist
    // if(token == null)return res.status(401).send("no token sent")
    // if(token == undefined)console.log("no token")

    if(token != "undefined" ){
        console.log('not undefined')

    jwt.verify(token, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.user = data
        console.log(data)
        next()
    })
    }else{return res.status(401).send("no token sent")}
    ///verify
    // jwt.verify(token, env.process.TOKEN, (err, data)=>{
    //     if(err) return res.sendStatus(401)
    //     req.user = data
    //     next()
    // })


}


////profile route; page and auth token
// app.post("/profile", (req, res, next)=>{

//     console.log("....profile.....")
//     console.log(req.headers)
//     // if(req.headers.token/)
//     authToken(req, res, next)
//     // req.user
//     console.log(req.user)
//     res.render()
//     res.json({})
// })


app.get("/profile/:username", (req, res, next)=>{
    console.log(req.params.username)
    ///connect to db and get data about the intneded username 

    /// check if the current user is the same of the intended user (username)
    /// then allow changes (send true value in a ???)

    let userData /// to be set with cookie; userData, currentUserData 

    // res.render("profile.ejs", {sameUser: false, userData: userData})

})

///editing profile route

const port = 4000 || process.env.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

