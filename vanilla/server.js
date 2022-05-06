
const express = require("express")
const app = express()
const path = require("path");
const { json } = require("express");
let cookieParser = require("cookie-parser")
app.use(cookieParser());

const multer = require("multer")


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

////sending pages; setting public dirs
// app.use(express.static("public"))
app.use("/home", express.static("./home"))
// app.use("/profile", express.static("./profile"))


////setting saving org account avatar imgs
// const upload = multer({dest:'avImgs/'});


// cookie temaplate; token; username, cUser, pUser; (username, name, bio, avimg, skills
// isUser and following, conts posts)

////////main features to implements 
////send and display followings (usernames)
///make follow 
///show folloing; get follow list, get the users at that following list 

///make org account 
///make the post 
///make the shared elements for the both cases 



///custom profile page; send profile template, wanted user data (puser)
    // other choice; express.static("./profile")
app.get("/profile/:username", async (req, res)=>{
    console.log(".....profile/:username/...........")
    console.log(req.params.username)

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let found = await dbb.collection("users").findOne({userName: req.params.username})

        
        if(found){
        console.log(".....current Profile .......")
        console.log(found)

        res.cookie("pUserName", found.userName)
        res.cookie("pName", found.name)
        res.cookie("pAvImg", found.avatar)
        res.cookie("pBio", found.bio)
        res.cookie("pFollowing", found.following)
        res.cookie("isUser", found.isUser)


        console.log(".......then to send account objects.......")
    
        res.sendFile(path.join(__dirname, "profile", "profile1.html"))

        }else{
            // res.send(`the page ${req.params.username} doesnt exist and ${found} is what found`)
            res.send(found)
        }

    })
})


/// //get additional data about the profile account; (that cant be set with
/// cookies); following, posts, may make two routes for follow objects and for
/// post objects to prevent some intercepting errors or so ...
app.get("/profileObjects", async (req, res)=>{
    console.log(".....get profile objects....")
    console.log(req.cookies)

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let found = await dbb.collection("users").findOne({userName: req.cookies.pUserName})

        ///send followings account object 
        let followingObjects = []
        let contsObjects = []
        // if(found.following != null && found.following != undefined){


            found.following.forEach( async(e)=>{
                ////users
                let d = await dbb.collection("users").findOne({userName: e})
                followingObjects.push({userName: d.userName, name: d.name, avatar: d.avatar,isUser: d.isUser })

                // if(followingObjects.length == Object.entries(found.following).length){
                //     console.log("will send the following object")
                //     res.json(followingObjects)
                // }
                if(followingObjects.length + contsObjects.length== Object.entries(found.following).length + Object.entries(found.conts).length){
                    console.log("will send the following object")
                    res.json({followingObjects, contsObjects})
                }
    
            })
            found.conts.forEach(async (e)=>{
                /// /conts is an array of objects that do; {orgName: --, postIndex:--, contType: , contValue: --}
                ///e.orgUserName, e.postIndex, contType(tag)
                let cont = await dbb.collection("orgs").findOne({orgName: e.orgName })
                contsObjects.push({post: cont[e.contIndex], contType: e.contType, contValue: e.contValue})
    
    
                if(followingObjects.length + contsObjects.length== Object.entries(found.following).length + Object.entries(found.conts).length){
                    console.log("will send the following object")
                    res.json({followingObjects, contsObjects})
                }
    
            })
    
        }

    // }
    )

}
)


////registering routes; encrypt
app.post("/regUser", async (req, res)=>{
    console.log(".....post regUser........")
    console.log(req.body)

try{
    ///check if exist in db; by em
    ////call mongodb
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        ///check if used email
        if(await dbb.collection("users").findOne({em: req.body.em})){

            console.log(await dbb.collection("users").findOne({em: req.body.em}))
            console.log("user does exist")
            res.json({status: 'user does exist'})
        }else{ ///not used email

            console.log("user doestn exist; register a new one")

            ///check if used username; 
            if(await dbb.collection("users").findOne({userName: req.body.userName})){
                res.json({status: "error; username used"})
            }else{

    ///encrypt the pw; 
    const hashedPassword = await bcrypt.hash(req.body.pw, 10)
    const user = {em: req.body.em, pw: hashedPassword, userName: req.body.userName, avatar: "../home/imgs/anders-jilden-Sc5RKXLBjGg-unsplash.jpg", bio: "...", name: req.body.userName, conts: [], isUser: true, following:[], skills:[]}
    // let newUser = await dbb.collection("users").insertOne(user) ///to get the id in db
    await dbb.collection("users").insertOne(user) ///to get the id in db

    // let newUser = await dbb.collection("users").findOne({em: req.body.em}) ////may use the sent one ??

        ////jwt; make token
        let token = jwt.sign(user.userName, process.env.TOKEN)

        ///send data and token

        ///localstorage; then save it at the client
        res.json({status: "created user", token: token, cUser: {userNmae: user.userName, name: user.name, avatar: user.avatar, isUser: user.isUser}})

        // remove 
        // res.json({user: {em: user.em, name: user.name}})
        // res.status(201).send(user)
        ///or 


            }


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
        let user = await dbb.collection("users").findOne({em: req.body.em})
        if(user){
            if(await bcrypt.compare(req.body.pw, user.pw)){
                console.log("correct cred; login")
                console.log(user)
                // res.send(user)
                ////jwt; make token
                let token = jwt.sign(user.userName, process.env.TOKEN)

                ///send data and token
                // res.cookie("cUserName", user.userName)
                // res.cookie("cName", user.name)
                // res.cookie("cAvatar", user.avatar)
                // res.cookie("isUser", user.isUser)
        
                res.cookie("token", token)

                ///user localstorage
                res.json({status: "correct login cred", token: token, cUser: {userName: user.userName, name: user.name, avatar: user.avatar, isUser: user.isUser}})

            }else{
                console.log("not correct cred")
                res.json("not correct creds")
            }
        }else{
            res.status(402).send("no user found")
        }
    })
})

app.post("/cUserFollowing", async(req, res)=>{

    console.log("......current user following......")
    console.log(req.body)

jwt.verify(req.body.token, process.env.TOKEN, (err, data)=>{
    if(err) return res.sendStatus(401)
    req.tokenData = data
})

mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let found = await dbb.collection("users").findOne({userName: req.tokenData})
    console.log(found)
    res.json({following: found.following})
})


})

////authenticate token middleware; useless
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
        console.log('defined')

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

/////////editing profile route
///authenticate the token, update data on the db
app.post("/editProfile", (req, res)=>{
    console.log(req.body)
    console.log(req.body.editedData.newName)
    ///validate
    jwt.verify(req.body.token, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
        console.log(data)
        // next()
    })

    ///// connect to db
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let found = await dbb.collection("users").findOne({userName: req.tokenData})
        console.log(found)
        let found2 = await dbb.collection("users").findOneAndUpdate({ userName : req.tokenData },{ $set: { name : req.body.editedData.newName,bio: req.body.editedData.newBio, skills: req.body.editedData.skills } })
        
        res.json({newName: req.body.editedData.newName, newBio: req.body.editedData.newBio, skills: req.body.editedData.skills })
        console.log(found2)
    })


})


///////following; 
////follow
app.post("/follow", (req, res)=>{
    console.log(".....add follow.......")
    console.log(req.body)

    ////decode jwt 
    jwt.verify(req.body.following, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
    })

    console.log(req.tokenData)
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        // let found = await dbb.collection("users").findOne({userName: req.tokenData})
        let found = await dbb.collection("users").updateOne({userName: req.tokenData}, {$push: {following: req.body.followed}})

        console.log("pushed")
        
})


})

///unfollow
app.post("/unfollow", (req, res)=>{
    console.log(".....remove follow.......")
    console.log(req.body)

    ////decode jwt 
    jwt.verify(req.body.following, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
    })

    console.log(req.tokenData)
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        // let found = await dbb.collection("users").findOne({userName: req.tokenData})
        let found = await dbb.collection("users").updateOne({userName: req.tokenData}, {$pull:{following: req.body.followed}})

        console.log("removed")
        
})

})

/////mode; register orgs; 
app.get("/mode", (req, res)=>{
    res.sendfile("./mode.html")
})


///////register org


//////multer stuff
let orgAvImg

let orgAvatarStoring = multer.diskStorage({
    destination: "./public/orgAvImgs",
    filename: async (req, file, cb)=>{
        console.log(file)

        orgAvImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        cb(null, orgAvImg)
    }
})
const orgAvatarImg = multer({storage: orgAvatarStoring})

//two routes; img route; /regOrgInfo, info route; /regOrgInfo  //one route; info and img route
// app.post("/regOrg", orgAvatarImg.any() ,(req, res)=>{

//     console.log(".......regOrg.........")
//     console.log(req.body)

//     if(req.body.userName){
//         mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//         let dbb = client.db()

//         ////encrypt pw 

//         ///check if used email
//         if(await dbb.collection("orgs").findOne({em: req.body.em})){

//             console.log(await dbb.collection("orgs").findOne({em: req.body.em}))
//             console.log("user does exist")
//             res.json({status: 'user does exist'})
//         }else{ ///not used email

//             console.log("user doestn exist; register a new one")

//             ///check if used username; 
//             if(await dbb.collection("orgs").findOne({userName: req.body.userName})){
//                 res.json({status: "error; username used"})
//             }else{

//             ///encrypt the pw; 
//             const hashed = await bcrypt.hash(req.body.pw, 10)
//             const user = {userName: req.body.userName, name: req.body.name, pw: hashed, em: req.body.em, locationsOfService: req.body.locationsOfService, following: [], followers: [], avatar: orgAvImg, members: req.body.members}
//             await dbb.collection("orgs").insertOne(user) ///to get the id in db

//             }}
// })

// }

// })


app.post("/regOrg", orgAvatarImg.any(), (req, res)=>{
    console.log(".......reqOrgAll.............")
    req.body.locationsOfService = req.body.locationsOfService.split(",")
    req.body.members = req.body.members.split(",")
    console.log(req.body)

    ////mongodb
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()

        ////encrypt pw 

        ///check if used email
        if(await dbb.collection("orgs").findOne({em: req.body.em})){

            console.log(await dbb.collection("orgs").findOne({em: req.body.em}))
            console.log("user does exist")
            res.json({status: 'user does exist'})
        }else{ ///not used email

            console.log("user doestn exist; register a new one")

            ///check if used username; 
            if(await dbb.collection("orgs").findOne({userName: req.body.userName})){
                res.json({status: "error; username used"})
            }else{

            ///encrypt the pw; 
            const hashed = await bcrypt.hash(req.body.pw, 10)
            const user = {userName: req.body.userName, name: req.body.name, pw: hashed, em: req.body.em, locationsOfService: req.body.locationsOfService, following: [], followers: [], avatar: orgAvImg, members: req.body.members}
            await dbb.collection("orgs").insertOne(user) ///to get the id in db

            }}
})

})


app.post("/editProfilefd",orgAvatarImg.any(), (req, res)=>{
    console.log(".....editProfilefd....")
    console.log(req.body)
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

console.log(obj); // { title: 'product' }

})

////////test code 

///mongodb init
// mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//     let dbb = client.db()
// })

///verify token; 
// jwt.verify(req.body, process.env.TOKEN, (err, data)=>{
//     if(err) return res.sendStatus(401)
//     req.tokenData = data
// })

////encrypt and decrypt pw; 



const port = 4000 || process.env.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

