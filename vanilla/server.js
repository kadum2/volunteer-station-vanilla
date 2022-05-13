
const express = require("express")
const app = express()
const path = require("path");
const { json } = require("express");
app.use(express.json())
let cookieParser = require("cookie-parser")
app.use(cookieParser());
const multer = require("multer")
const env = require("dotenv")
env.config()

let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { posix } = require("path");
let mongodb = require("mongodb").MongoClient  ///mongodb atlas

/////config
// require("ejs")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

////sending pages; setting public dirs
app.use("/home", express.static("./home"))
app.use("/profile/:username", express.static("profile"))
app.use(express.static("./public"))



//////////routes 

///profile
/////f1; basic profile info; cookies; 
app.get("/profileData/:username", (req, res)=>{

    console.log("..........profile Data ........")
    console.log(req.params.username)

    ////check db if exist
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let found = await dbb.collection("users").findOne({userName: req.params.username})
        if(!found) found = await dbb.collection("orgs").findOne({userName: req.params.username})

        if(found){
        // console.log(".....current Profile .......")
        // console.log(found)

        res.cookie("pUserName", found.userName)
        res.cookie("pName", found.name)
        res.cookie("pAvImg", found.avatar)
        res.cookie("pBio", found.bio)
        res.cookie("pFollowing", found.following)
        res.cookie("isUser", found.isUser)

        if(found.isUser){ ///user case 
            let followingObjects = []
            let contsObjects = []

            found.following.forEach( async(e)=>{
                let d = await dbb.collection("users").findOne({userName: e})
                followingObjects.push({userName: d.userName, name: d.name, avatar: d.avatar,isUser: d.isUser })
                if(followingObjects.length + contsObjects.length== Object.entries(found.following).length + Object.entries(found.conts).length){
                    console.log("will send the following object")
                    res.json({followingObjects, contsObjects})
                }
            })
            found.conts.forEach(async (e)=>{
                let cont = await dbb.collection("orgs").findOne({orgName: e.orgName })
                contsObjects.push({post: cont[e.contIndex], contType: e.contType, contValue: e.contValue})
                if(followingObjects.length + contsObjects.length== Object.entries(found.following).length + Object.entries(found.conts).length){
                    console.log("will send the following object")
                    res.json({followingObjects, contsObjects})
                }
            })

        }else{ ///org case 
            let members = []

        
            console.log("........found members...........")
            console.log(found.members)

            found.members.forEach( async(e)=>{
                let d = await dbb.collection("users").findOne({userName: e})
                members.push({userName: d.userName, name: d.name, avatar: d.avatar,isUser: d.isUser })
                if(members.length == Object.entries(found.members).length ){
                    console.log("will send the members objects")
                    res.json({members, posts: found.posts})
                }
            })

            console.log("org")
            // res.json({})

        }
        }else{ ///not found the profile user 
        
        console.log("not found")
            res.sendStatus(404)
        
        
        }
    })
})


////registering user; encrypt; send data; 
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
    const user = {em: req.body.em, pw: hashedPassword, userName: req.body.userName, avatar: "../home/imgs/anders-jilden-Sc5RKXLBjGg-unsplash.jpg", bio: "...", name: req.body.userName, conts: [], isUser: true, following:[], followers:[], skills:[]}
    // let newUser = await dbb.collection("users").insertOne(user) ///to get the id in db
    await dbb.collection("users").insertOne(user) ///to get the id in db

    // let newUser = await dbb.collection("users").findOne({em: req.body.em}) ////may use the sent one ??

        ////jwt; make token
        let token = jwt.sign(user.userName, process.env.TOKEN)

        ///send data and token localstorage; then save it at the client
        res.json({status: "created user", token: token, cUser: {userNmae: user.userName, name: user.name, avatar: user.avatar, following: user.following, isUser: user.isUser}})
            }
        }
        })
}catch{
    res.status(500).send()
}
})

////login user and org???; 
app.post("/login", async (req, res)=>{
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        ///check if exist
        let user = await dbb.collection("users").findOne({em: req.body.em})
        if(user == undefined) user = await dbb.collection("orgs").findOne({em: req.body.em})
        if(user){
            if(await bcrypt.compare(req.body.pw, user.pw)){
                console.log("correct cred; login")
                console.log(user)
                let token = jwt.sign(user.userName, process.env.TOKEN)
                // res.cookie("token", token)

                ///localstorage
                res.json({status: "correct login cred", token: token, cUser: {userName: user.userName, name: user.name, avatar: user.avatar,following: user.following, isUser: user.isUser}})

            }else{
                console.log("not correct cred")
                res.json("not correct creds")
            }
        }else{
            res.status(402).send("no user found")
        }
    })
})


// ////may mix it with the reg and login routes 
// app.post("/cUserFollowing", async(req, res)=>{

//     console.log("......current user following......")
//     console.log(req.body)

// jwt.verify(req.body.token, process.env.TOKEN, (err, data)=>{
//     if(err) return res.sendStatus(401)
//     req.tokenData = data
// })

// mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//     let dbb = client.db()
//     let found = await dbb.collection("users").findOne({userName: req.tokenData})
//     console.log(found)
//     res.json({following: found.following})
// })


// })



/////////editing profile route; no need for it; delete
///authenticate the token, update data on the db; 

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

let userAvImg
let userAvatarStoring = multer.diskStorage({
    destination: "./public/userAvImgs",
    filename: async (req, file, cb)=>{
        console.log(file)

        userAvImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        cb(null, userAvImg)
    }
})
const userAvatarImg = multer({storage: userAvatarStoring})

app.post("/editProfilefd",userAvatarImg.any(), (req, res)=>{
    console.log(".....editProfilefd....")
    req.body.skills = req.body.skills.split(",") ////make skills an array 
    console.log(req.body)

    /////jwt
    jwt.verify(req.body.token, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
        console.log(data)
    })

    ///// connect to db
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        if(req.body.newName) await dbb.collection("users").findOneAndUpdate({userName: req.tokenData}, {$set: {name: req.body.newName}})
        if(req.body.newBio) await dbb.collection("users").findOneAndUpdate({userName: req.tokenData}, {$set: {bio: req.body.newBio}})
        if(req.body.av) await dbb.collection("users").findOneAndUpdate({userName: req.tokenData}, {$set: {avatar: req.body.av}})

        ///skills deploying
        if(req.body.skills)await dbb.collection("users").findOneAndUpdate({userName: req.tokenData}, {$push: {skills: req.body.skills}})

        res.json({newName: req.body.newName, newBio: req.body.newBio, skills: req.body.skills, newAvatar: userAvImg })
    })
})

app.get("/cfollowing", async (req, res)=>{
    console.log("......................")
    console.log(req.headers.authorization)

    jwt.verify(req.headers.authorization, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
    })

    console.log(req.tokenData)

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let found = await dbb.collection("users").findOne({userName: req.tokenData})

    console.log("...........cfollowing ............   .......")

    if(!found)found = await dbb.collection("orgs").findOne({userName: req.tokenData})
    res.json({following: found.following})
})
})

///////following; toggle method; 
////follow
app.post("/follow", (req, res)=>{
    console.log(".....follow.......")
    console.log(req.body)

    ////decode jwt 
    jwt.verify(req.body.following, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
    })
        // if(!follow) 
        // if(follow) {///remove it 

        // }else{///add it 

        // }

        ////check if exist in the follow list to remove it
        ////if not exist in the follow list to add it

    console.log(req.tokenData)
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()

        let follow = await dbb.collection("users").findOne({userName: req.tokenData})

        if(follow){ ///user case
        follow = follow.following.includes(req.body.followed)
            if(follow){///if follow; remove it 
                await dbb.collection("users").updateOne({userName: req.tokenData}, {$pull:{following: req.body.followed}})
                /////remove from followed from the other side
                await dbb.collection("users").updateOne({userName: req.body.followed}, {$pull:{followers: req.tokenData}})

            }else{///add it 
        await dbb.collection("users").updateOne({userName: req.tokenData}, {$push: {following: req.body.followed}})
        ///add to followed to the other side 
        await dbb.collection("users").updateOne({userName: req.body.followed}, {$push: {followers: req.tokenData}})
            }
        }else{ ///org case 
            follow = await dbb.collection("orgs").findOne({userName: req.tokenData})
            follow = follow.following.includes(req.body.followed)
            if(follow){///if follow; remove it
                await dbb.collection("orgs").updateOne({userName: req.tokenData}, {$pull:{following: req.body.followed}})
                ///remove from followed from the other side 
                await dbb.collection("orgs").updateOne({userName: req.body.followed}, {$pull:{followers: req.tokenData}})
            }else{///add it 
                await dbb.collection("orgs").updateOne({userName: req.tokenData}, {$push: {following: req.body.followed}})
                ////add to followed to the other side 
                await dbb.collection("orgs").updateOne({userName: req.body.followed}, {$push: {followers: req.tokenData}})
            }
        }
})


})

/////storing post imgs
///need to store the list of imgs
/////get current state and todo imgs 

let postCstateImg
let postcStateImgsList

let postTodoImg
let postTodoImgsList

let postImgStoring = multer.diskStorage({
    
    destination: "./public/posts",
    // destination: (req, file, cb)=>{
    //     if(file.fieldname == "cStateImgs"){
    //         cb(null, "./public/posts/cState")
    //     }else{
    //         cb(null, "./public/posts/todo")
    //     }
    // },
    filename: async (req, file, cb)=>{
        console.log(file)
        if(file.fieldname == "cStateImgs"){
            postCstateImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            postcStateImgsList.push(postCstateImg)
            cb(null, postCstateImg)
        }else{
            postTodoImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
            postTodoImgsList.push(postTodoImg)
            cb(null, postTodoImg)

        }

    }
})
const postImgs = multer({storage: postImgStoring})

/////get todo imgs; no need

let postTodoImgStoring = multer.diskStorage({
    destination: "./public/posts/cState",
    filename: async (req, file, cb)=>{
        console.log(file)

        postTodoImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        postTodoImgsList.push(postTodoImg)
        cb(null, postTodoImg)
    }
})
const postTodoImgs = multer({storage: postTodoImgStoring})


/////make post; not to insert imgs; but make specific routes 
app.post("/posts", (req, res, next)=>{ postcStateImgsList = []; postTodoImgsList=[];next()}, postImgs.any(), async (req, res)=>{
    console.log("...........make post..............")
    console.log(req.body)
    console.log(req.headers.authorization)
    console.log(postcStateImgsList)
    console.log(postTodoImgsList)

    // req.body.skills = req.body.skills.map(e=>{skillType: e.split(",")[0],reqNum: e.split(",")[1]})
    req.body.skills = req.body.skills.map(e=>e.split(","))
    req.body.skills = req.body.skills.map(e=>{
        return {type:e[0], reqNum: e[1], contri:[]}
    })
    req.body.knowledge = req.body.knowledge.map(e=>e.split(","))
    req.body.knowledge= req.body.knowledge.map(e=>{
        return {type:e[0], reqNum: e[1], contri:[]}
    })
    
    req.body.toolsMaterials = req.body.toolsMaterials.map(e=>e.split(","))
    req.body.toolsMaterials= req.body.toolsMaterials.map(e=>{
        return {type:e[0], reqNum: e[1], contri:[]}
    })

    console.log(req.body.skills)
    //////add a contri section for each subtag; 

    ////decode; 
    jwt.verify(req.headers.authorization, process.env.TOKEN, (err, data)=>{
        if(err) return res.sendStatus(401)
        req.tokenData = data
    })


    ////mongodb
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{

        let dbb = client.db()

        
        /////prepare some additional stuff; make post id; orgUserNamePostIndex
        let index = (await dbb.collection("posts").find({orgUserName: req.tokenData}).toArray()).length
        let postID = req.tokenData+"@"+(index + 1)
        let found = await dbb.collection("orgs").findOne({userName: req.tokenData})
        console.log(found)
        let name = found.name
        let avatar = found.avatar

        // let 

    //////new date(); minutes; hours; day; month; year
    let da= new Date().getMinutes() + ":"+( new Date().getHours()>12? + new Date().getHours() -12 + "pm": new Date().getHours() +"am")+","+new Date().getDay()+"/"+new Date().getMonth()+"/"+new Date().getFullYear()
    ////make object 

    await dbb.collection("posts").insertOne({orgUserName: req.tokenData, orgName: name, orgAvatar: avatar,dateOfUpload: da, postID ,cStateImgs: postcStateImgsList, todoImgs: postTodoImgsList, cStateInfo: req.body.cStateInfo, todoInfo: req.body.todoInfo, campType: req.body.campType, timeState: req.body.timeState, baseLocation: req.body.baseLocation, campPrototype: req.body.campPrototype, location: req.body.location, campTime: req.body.campTime, skills: req.body.skills, knowledge: req.body.knowledge, toolsMaterials: req.body.toolsMaterials, neededDonation: req.body.donation, currentDonation: 0})
    
})

})

// app.post("/fdcImgs", (req, res, next)=>{ postcStateImgsList = [];next()}, postcStateImgs.any(), (req, res)=>{

// })

// app.post("/fdTodoImgs", (req, res, next)=>{ postTodoImgsList = [];next()}, postTodoImgs.any(), (req, res)=>{

// })


////mode; 
// app.get("ismode", (req, res)=>{
//     res.sendfile("./mode2.html")
// })
// app.post("ismode", (req, res)=>{
//     console.log(req.body)
//     if(req.body.sw1 == "admin" && req.body.sw2 == "not admin"){
//         console.log("jwt")
//         let token = jwt.sign("true", process.env.TOKEN)
//         res.json({status: true, token: token})
//     }else{
//         console.log("dont send mode")
//         res.json({status: false})
//     }

// })

// app.get("/mode", (req, res)=>{

//     if(req.headers.token){
//         /////validate 
//         jwt.verify(token, process.env.TOKEN, (err, data)=>{
//             if(err) return res.sendStatus(401)
//             req.user = data
//             next()
//         })
    

//     }else{
//         res.redirect("/ismode")
//     }
// })

// app.post("/mode", (req, res)=>{

//     console.log(req.body)
//     if(req.body.sw1 == "admin" && req.body.sw2 == "not admin"){
//         console.log("send mode")
//         // res.send("hi there")
//         // res.sendfile('./mode.html')
//         res.sendFile(path.join(__dirname, "mode.html"))
//     }else{
//         console.log("dont send mode")
//     }
// })

app.get("/posts", (req, res)=>{
    console.log("............post...........")
mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
    let found = await dbb.collection("posts").find({}).toArray()
    res.json({found})
})
})


app.post("/contribute", async (req, res)=>{

    console.log(".......contribute.......")
    console.log(req.body)

    ////decode the token 
    jwt.verify(req.headers.authorization, process.env.TOKEN, (err, data)=>{
    if(err) return res.sendStatus(401)
    req.tokenData = data
})

console.log(req.tokenData)

    ///set the contri object 

mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()

    let mainTag = req.body.mainTag
    let index = req.body.index

    let pushObj = {};
    pushObj[mainTag + "."+ index + ".contri"] = req.tokenData ;

    console.log(pushObj)

    let r = await dbb.collection("posts").findOne({postID: req.body.postIndex})
    // console.log(r)
    // console.log(r[mainTag][index].contri)


    //////for add or delete 
    if(r[mainTag][index].contri.includes(req.tokenData)){
        console.log("true; then remove")
        let rs = await dbb.collection("posts").findOneAndUpdate({postID: req.body.postIndex}, {$pull: pushObj})
        console.log(rs)
    }else{
        console.log("false; then add")
        let r = await dbb.collection("posts").findOneAndUpdate({postID: req.body.postIndex}, {$push: pushObj})
        console.log(r)
    }
})
})



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
            const user = {userName: req.body.userName, name: req.body.name,bio: req.body.bio, pw: hashed, em: req.body.em, locationsOfService: req.body.locationsOfService, following: [], followers: [], avatar: orgAvImg, members: req.body.members, posts: [], isUser: false}
            await dbb.collection("orgs").insertOne(user) ///to get the id in db
            }}
})
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

}
    ///verify
    // jwt.verify(token, process.env.TOKEN, (err, data)=>{
    //     if(err) return res.sendStatus(401)
    //     req.user = data
    //     next()
    // })


app.get("/auth", (req, res)=>{
    console.log("..........auth..........")
    console.log(req.body)
    console.log(req.headers)

})
const port = 4000 || process.env.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

