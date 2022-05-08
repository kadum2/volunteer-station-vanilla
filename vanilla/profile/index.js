
        /////dom elements to select 
        ///basic info; all cases; 
        let pUserName = document.querySelector("#pUserName")
        let pName = document.querySelector("#pName")
        let pBio = document.querySelector("#pBio")
        let pAvImg = document.querySelector("#pAvImg")

        // let followBtn = document.querySelector("#followBtn")

        //templates
        let auth = document.querySelector("#auth")
        let editing = document.querySelector("#editing")
        let info = document.querySelector("#info")




        ////data containers 
        let cookies

        function readCookies() {
            cookies = document.cookie.replaceAll("%20", " ").replaceAll("%2F", "/").split('; ').reduce((prev,
                current) => {
                const [name, ...value] = current.split('=');
                prev[name] = value.join('=');
                return prev;
            }, {})
        }
        console.log(cookies)

        ///////features 

        async function checkAccout() {

            console.log(cookies)

            ////check profile
            if (cookies.pIsUser) { //user case
                console.log("profile is user")
                ///get the conts
                /// conts dom, make post object, insert cookie data; insert posts objects into the posts dom container
            } else { ///org case 
                console.log("profile is org")
                ////get made conts 
            }



            ///////////current user type; no account, account; user; owner, not owner, org; owner, not owner
            ///not account; register and login
            if (localStorage.getItem("cUser") == undefined) { ////no account 

                console.log("no user; should generate the auth")
                auth.innerHTML = `            
                <div id="registerPanel">
                    <b>register</b>
                    <input id="register-userName" type="text" placeholder="username">
                    <input id="register-em" type="email" placeholder="email">
                    <input id="register-pw" type="text" placeholder="password">
                    <button id="regBtn">user register</button>
                </div>
                <div id="loginPanel">
                    <b>login</b>
                    <input id="login-em" type="email" placeholder="email">
                    <input id="login-pw" type="text" placeholder="password">
                    <button id="loginBtn">login</button>
                </div>`

                ////register
                let register = document.querySelector("#registerPanel")
                let registerEm = document.querySelector("#register-em")
                let registerPw = document.querySelector("#register-pw")
                let regiseterUn = document.querySelector("#register-userName")
                let regBtn = document.querySelector("#regBtn")

                ////login
                let login = document.querySelector("#loginPanel")
                let loginEm = document.querySelector("#login-em")
                let loginPw = document.querySelector("#login-pw")
                let loginBtn = document.querySelector("#loginBtn")

                // register.addEventListener("click", () =>
                // console.log("register clicked"))
                regBtn.addEventListener("click", async () => {
                    console.log(regiseterUn.value)
                    console.log(registerEm.value)
                    console.log(registerPw.value)

                    ///check if exist
                    if (registerEm.value && registerPw.value && regiseterUn.value) {

                        ///make the object data to be send 
                        let newUser = {
                            em: registerEm.value,
                            pw: registerPw.value,
                            userName: regiseterUn.value
                        }

                        ////send and recieve data
                        let d = await fetch("/regUser", {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(newUser)
                        })
                        let pd = await d.json()
                        console.log(pd)

                        ////set data to localstorage
                        localStorage.setItem("token", pd.token)
                        localStorage.setItem("cUser", JSON.stringify(pd.cUser))
                        // localStorage.setCookie()

                        /// deploy the received data; may use a function; make user object
                        // auth.innerHTML = `em: ${pd.em}, pw${pd.pw}`

                        ///empty the values
                        regiseterUn.value = ""
                        registerEm.value = ""
                        registerPw.value = ""
                        readCookies()
                        checkAccout()

                    }
                })

                ///login 
                loginBtn.addEventListener("click", async () => {
                    console.log(loginEm.value)
                    console.log(loginPw.value)

                    ///check if exist
                    if (loginEm.value && loginPw.value) {

                        ///make the object data to be send 
                        let newUser = {
                            em: loginEm.value,
                            pw: loginPw.value
                        }

                        ////send and recieve data
                        let d = await fetch("/login", {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(newUser)
                        })
                        let pd = await d.json()
                        console.log(pd)

                        ///set localstorage data 
                        localStorage.setItem("token", pd.token)
                        localStorage.setItem("cUser", JSON.stringify(pd.cUser))

                        ///deploy the received data; may use a function
                        // auth.innerHTML = `em: ${pd.em}, pw${pd.pw}`

                        ///empty the values
                        loginEm.value = ""
                        loginPw.value = ""


                        readCookies()
                        checkAccout()

                    }
                })

            } else { //account; 

                console.log(".....account.....")
                let cUserJson = JSON.parse(localStorage.getItem("cUser"))

                /////deploy the data; make the cUser object
                readCookies()
                let cUser = document.createElement("div")
                cUser.classList.add("userObject")
                cUser.addEventListener("click", () => location.href =
                    `http://localhost:4000/profile/${cUserJson.userName}`)
                let cAv = document.createElement("img")
                cAv.src = "../home/" + cUserJson.avatar
                let cP = document.createElement("p")
                cP.textContent = cUserJson.userName
                cUser.append(cAv, cP)

                ////get the following users; to check if can follow the profile user 
                console.log(localStorage.getItem("token"))
                let d = await fetch("/cUserFollowing", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem("token")
                    })
                })
                let pd = await d.json()
                console.log(pd)
                if (pd.following.includes(cookies.pUserName)) {
                    displayUnfollowBtn()
                } else {
                    displayFollowBtn()
                }


                ///create logout button
                let logoutBtn = document.createElement("button")
                logoutBtn.id = "logoutBtn"
                logoutBtn.textContent = "logout"
                logoutBtn.addEventListener("click", () => {
                    localStorage.clear()

                    console.log("logout")

                    document.querySelector("#cUserTemplate").innerHTML = ""
                    editing.innerHTML = ""
                    checkAccout()
                })

                document.querySelector("#cUserTemplate").append(cUser, logoutBtn)
                auth.innerHTML = ""

                if (cookies.pUserName == cUserJson.userName) { //owner; edit option
                    ///user; isUser true
                    if (cUserJson.isUser) {
                        ///display editing ??; 
                        pUserName.innerHTML += "<small> (you) </small>"
                        let skillCounter = 1
                        let editingTemplate = `
                            <input type="text" placeholder="new name" id="newName">
                            <input type="text" placeholder="new bio" id="newBio">

                            <label to="newAvImg">change img</label>
                            <input type="file" id="newAvImg">
                            
                            <div id="skillsCont">
                                <select name="skill1" id="skill1" class="skill">
                                    <option value="select skill">select skill 1</option>
                                    <option value="skill1">skill1</option>
                                    <option value="skill2">skill2</option>
                                    <option value="skill3">skill3</option>
                                </select>
                            </div>
                            <input type="button" value="+" id="addMoreSkill">
                            <button id="sendEditBtn">send edit </button>
                            `

                        editing.innerHTML += editingTemplate
                        let skillscont = document.querySelector("#skillsCont")
                        // skills.style.background("red")
                        let addMoreSkill = document.querySelector("#addMoreSkill")
                        addMoreSkill.addEventListener("click", () => {
                            console.log("clicked")
                            console.log(skillCounter)
                            let addMore = `
                            <select name="skills" id="skill${skillCounter++}" class="skill">
                                <option value="selectskill">select skill${skillCounter}</option>
                                <option value="skill1">skill1</option>
                                <option value="skill2">skill2</option>
                                <option value="skill3">skill3</option>
                            </select>`
                            skillscont.innerHTML += addMore
                        })

                        let sendEditBtn = document.querySelector("#sendEditBtn")
                        sendEditBtn.addEventListener("click", async () => {
                            console.log("clicked on sending edit btn")
                            ////check if not empty; one by one

                            let editedData = {
                                newName: document.querySelector("#newName").value,
                                newBio: document.querySelector("#newBio").value,
                                skills: [...document.querySelectorAll(".skill")].map(e => e
                                    .value)
                            }

                            let fd = new FormData()
                            let avImg = document.querySelector("#newAvImg").files[0]

                            if (document.querySelector("#newName").value) fd.append("newName", document
                                .querySelector("#newName").value)
                            if (document.querySelector("#newBio").value) fd.append("newBio", document
                                .querySelector("#newBio").value)
                            if ([...document.querySelectorAll(".skill")].map(e => e.value)) fd.append(
                                "skills", [...document.querySelectorAll(".skill")].map(e => e.value)
                            )
                            if (avImg) fd.append("av", avImg)
                            fd.append("token", localStorage.getItem("token"))

                            let d = await fetch("/editProfilefd", {
                                method: "POST",
                                body: fd
                            })

                            ////empty the values 
                            document.querySelector("#newName").value
                            document.querySelector("#newBio").value
                        })

                    } else {

                    }
                    ///org; isUser false

                } else { //not owner; follow option
                    console.log("not the same user")
                    ///user; isUser true
                    ///org; isUser false
                }

            }
        }

        //main profile data (onload) 

        window.onload = async () => {

            console.log(window.location.pathname.split("/")[2])

            ////insert basic info;

            let dd = await fetch("/profileData/" + window.location.pathname.split("/")[2])

            readCookies()

            pUserName.textContent = cookies.pUserName
            pName.textContent = cookies.pName
            pBio.textContent = cookies.pBio
            pAvImg.style.background = `url(../${cookies.pAvImg})`

            console.log("checking accounts")
            checkAccout()
            console.log("after checking account")

            ////get the additional profile info; following, posts 
            let d = await fetch("/profileObjects")
            console.log(d)
            let pd = await d.json()

            console.log(pd)
            console.log(pd.followingObjects)
            console.log(typeof pd.followingObjects)
            console.log(Object.values(pd.followingObjects))

            let followingUsernames = []


            // Object.entries(pd.followingObjects).forEach(e => {

            //     console.log(e[1])
            //     let userObject = document.createElement("div")
            //     userObject.classList.add("userObject")
            //     userObject.addEventListener("click", () => {
            //         location.href = `http://localhost:4000/profile/${e[1].userName}`
            //     })

            //     userObject.innerHTML = `
            //         <img src="${e[1].avatar}" alt="">
            //         <h2>${e[1].userName}</h2>
            //         <h4>${e[1].name}</h4>`

            //     document.querySelector("#following").append(userObject)

            // })

            pd.followingObjects.forEach(e => {

                /////add followings objects 
                // console.log(e)
                let userObject = document.createElement("div")
                userObject.classList.add("userObject")
                userObject.addEventListener("click", () => {
                    location.href = `http://localhost:4000/profile/${e.userName}`
                })

                userObject.innerHTML = `
                <img src="${e.avatar}" alt="">
                <h2>${e.userName}</h2>
                <h4>${e.name}</h4>`

                document.querySelector("#following").append(userObject)
            })


            ////trying to send auth header; 
            let au = fetch("/auth",{
                headers: {"Authorization": "secret token"}
            })

        }

        function displayFollowBtn() {
            console.log("will display follow btn")

            let followOptions = {
                // following: JSON.parse(localStorage.getItem("cUser")).userName,
                following: localStorage.getItem("token"),
                followed: cookies.pUserName
            }

            console.log(followOptions)
            let followBtn = document.createElement("button")
            followBtn.textContent = "follow"

            followBtn.addEventListener("click", () => {
                let d = fetch("/follow", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(followOptions)
                    // body: cookies.pUserName
                })
            })

            // info.append()
            info.insertBefore(followBtn, info.firstElementChild)


        }

        function displayUnfollowBtn() {
            console.log("will display unfollow btn")

            let unfollowOptions = {
                // following: JSON.parse(localStorage.getItem("cUser")).userName,
                following: localStorage.getItem("token"),
                followed: cookies.pUserName
            }

            console.log(unfollowOptions)
            let unfollow = document.createElement("button")
            unfollow.textContent = "unfollow"

            unfollow.addEventListener("click", () => {
                let d = fetch("/unfollow", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(unfollowOptions)
                    // body: cookies.pUserName
                })
            })

            // info.append()
            info.insertBefore(unfollow, info.firstElementChild)

        }

        ////test code 


console.log("from profile folder")
