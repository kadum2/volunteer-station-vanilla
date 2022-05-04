

        /////dom elements to select 
        ///basic info; all cases; 
        let pUserName = document.querySelector("#pUserName")
        let pName = document.querySelector("#pName")
        let pBio = document.querySelector("#pBio")
        let pAvImg = document.querySelector("#pAvImg")


        //auth
        let auth = document.querySelector("#auth")


        console.log("hello from profile js")

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
        readCookies()


        console.log(cookies)

        ///////features 

        function checkAccout() {

            console.log(cookies)

            //profile type; user case, org case
            if (cookies.pIsUser) {
                console.log("profile is user") ///user case
                ///get the conts
                /// conts dom, make post object, insert cookie data; insert posts objects into the posts dom container
            } else {
                console.log("profile is org") ///org case 
                ////get made conts 
            }



            ////current user type; no account, account; user; owner, not owner, org; owner, not owner
            ///not account; register and login
            if (localStorage.getItem("cUser") == undefined) {


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
                    if (registerEm && registerPw && regiseterUn) {

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
                    if (loginEm && loginPw) {

                        ///make the object data to be send 
                        let newUser = {
                            em: loginEm.value,
                            pw: loginPw.value
                        }

                        ////send and recieve data
                        let d = await fetch("/loginUser", {
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
                console.log(JSON.parse(localStorage.getItem("cUser")))
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
                cP.textContent = cUserJson.name
                cUser.append(cAv, cP)

                ///create logout button
                let logoutBtn = document.createElement("button")
                logoutBtn.id = "logoutBtn"
                logoutBtn.textContent = "logout"
                logoutBtn.addEventListener("click", () => {
                    localStorage.clear()

                    console.log("logout")

                    document.querySelector("#cUserTemplate").innerHTML = ""
                    checkAccout()
                })

                document.querySelector("#cUserTemplate").append(cUser, logoutBtn)
                auth.innerHTML = ""

                if (cookies.pUserName == cUserJson.userName) { //owner; edit option
                    ///user; isUser true
                    if (cUserJson.isUser) {
                        ///display editing ??; 
                        pUserName.innerHTML += "<small> you </small>"
                        let editing = document.createElement("div")
                        let edBio
                        let edName
                        let edSkills = document.createElement("option")

                    } else {

                    }
                    ///org; isUser false

                } else { //not owner; follow option
                    console.log("not the same user")
                    console.log(cookies.pUserName)
                    console.log(cUserJson)
                    ///user; isUser true
                    ///org; isUser false
                }

            }
        }

        window.onclick = () => {
            console.log(encodeURI(document.cookie))
            console.log(document.cookie)
        }

        //main profile data (onload) 

        window.onload = () => {
            ////insert basic info;

            pUserName.textContent = cookies.pUserName
            pName.textContent = cookies.pName
            pBio.textContent = cookies.pBio
            pAvImg.style.background = `url(../home/${cookies.pAvImg})`

            checkAccout()

        }


        ////test code 


