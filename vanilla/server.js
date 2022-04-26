
const express = require("express")
const app = express()
const path = require("path");
const { env } = require("process");

// require("ejs")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

///setting public dirs
app.use(express.static("public"))
// app.use("/home",express.static("./home"))
// app.use("/profile",express.static("./profile"))


///home route
let container = [1, 2, 3]
app.get("/home", (req, res)=>{
    res.render("home.ejs", {container})
})


///profile route
app.get("/profile", (req, res)=>{
    res.render("profile.ejs")
})



const port = 4000 || env.process.PORT
app.listen(port, ()=>console.log(`listening on port ${port}`))

