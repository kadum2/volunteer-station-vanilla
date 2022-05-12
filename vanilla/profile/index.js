
        /////dom elements to select 

        ///basic info; all cases; 
        let pUserName = document.querySelector("#pUserName")
        let pName = document.querySelector("#pName")
        let pBio = document.querySelector("#pBio")
        let pAvImg = document.querySelector("#pAvImg")

        //templates
        let auth = document.querySelector("#auth")
        let editing = document.querySelector("#editing")
        let info = document.querySelector("#info")

        ////data containers 
        /////puser
        let cookies
        function readCookies() {
            cookies = document.cookie.replaceAll("%20", " ").replaceAll("%2F", "/").split('; ').reduce((prev,
                current) => {
                const [name, ...value] = current.split('=');
                prev[name] = value.join('=');
                return prev;
            }, {})
        }

        ////cuser
        let cuser




        ///////features 

            function insertProfileData(data){


                pUserName.textContent = cookies.pUserName
                pName.textContent = cookies.pName
                pBio.textContent = cookies.pBio
                pAvImg.style.background = `url(../${cookies.pAvImg})`
    
    
                ////get the additional profile info; following, posts 
    
    
                let followingUsernames = []
    
                // data.followingObjects.forEach(e => {
    
                //     /////add followings objects 
                //     let userObject = document.createElement("div")
                //     userObject.classList.add("userObject")
                //     userObject.addEventListener("click", () => {
                //         location.href = `http://localhost:4000/profile/${e.userName}`
                //     })
    
                //     console.log(e.avatar)
                //     userObject.innerHTML = `
                //     <img src="../../${e.avatar}" alt="">
                //     <h2>${e.userName}</h2>
                //     <h4>${e.name}</h4>`
    
                //     document.querySelector("#following").append(userObject)
                // })
    



                // let ?? = document 
                if(cookies.isUser){ ///user case

                }else{ ///org case 

                }

            }

            async function register(em, pw, userName){
                        ///make the object data to be send 
                        let newUser = {
                            em: em,
                            pw: pw,
                            userName: userName
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

                        // return pd ??

            } ////didnt work; undefined 

            async function login(em, pw){

            } ////didnt work; undefined 

            async function regLoginPanels(){
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

                ////register
                regBtn.addEventListener("click", async () => {

                    ///check if exist
                    if (registerEm.value && registerPw.value && regiseterUn.value) {

                    // register(registerEm.value, registerPw, regiseterUn.value)
                                            ///make the object data to be send 
                                            let newUser = {
                                                em: em,
                                                pw: pw,
                                                userName: userName
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
                    
                                            // return pd ??
                    

                        ///empty the values
                        regiseterUn.value = ""
                        registerEm.value = ""
                        registerPw.value = ""
                        readCookies()
                        checkAccount()
                    }
                })
                ///login 
                loginBtn.addEventListener("click", async () => {

                    ///check if exist
                    if (loginEm.value && loginPw.value) {
                        console.log("......login......")

                        // login(loginEm.value, loginPw.value)
                        /////////login
                        // console.log(".....login.......")

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

                        // return pd ??


                        ///empty the values
                        loginEm.value = ""
                        loginPw.value = ""

                        readCookies()
                        checkAccount()

                    }
                })

            }

            function createUserObject(){
                let cuser = document.createElement("div")
                cuser.classList.add("userObject")
                cuser.addEventListener("click", () => location.href =
                    `http://localhost:4000/profile/${cUserJson.userName}`)
                let cAv = document.createElement("img")
                if(cUserJson.isUser){
                cAv.src = "../" + cUserJson.avatar
                }else{
                    cAv.src = "/orgAvImgs/" + cUserJson.avatar
                }
                let cP = document.createElement("p")
                cP.textContent = cUserJson.userName
                cuser.append(cAv, cP)
                return cuser
            }

            function createLogoutBtn(cUser){
                let logoutBtn = document.createElement("button")
                logoutBtn.id = "logoutBtn"
                logoutBtn.textContent = "logout"
                logoutBtn.addEventListener("click", () => {
                    localStorage.clear()
                    console.log("logout")
                    document.querySelector("#cUserTemplate").innerHTML = ""
                    editing.innerHTML = ""
                    checkAccount()
                })
                document.querySelector("#cUserTemplate").append(cUser, logoutBtn)
                auth.innerHTML = ""
            }

            function displayBasicEditing(){
                let basicEditingTemplate = `
                <input type="text" placeholder="new name" id="newName">
                <input type="text" placeholder="new bio" id="newBio">
                <label to="newAvImg">change img</label>
                <input type="file" id="newAvImg">`
                editing.innerHTML += basicEditingTemplate
            }

            function displayUserEditing(){
                        ///display editing ??; 
                        let skillCounter = 1
                        let userEditingTemplate = `
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

                        editing.innerHTML += userEditingTemplate
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
                            // fd.append("token", localStorage.getItem("token"))

                            let d = await fetch("/editProfilefd", {
                                headers: new Headers({"authorization": localStorage.getItem("token")}),
                                method: "POST",
                                body: fd
                            })

                            ////empty the values 
                            document.querySelector("#newName").value = ""
                            document.querySelector("#newBio").value = ""
                            document.avImg = null
                        })

            }

            function displayOrgEditing(){ ////post making 
                let postMakingTemplate = `<div id="createPost">
                <div class="post">
                    <!-- first seciton -->
                    <div class="postHeader flex">
                        <div class="orgObject flex">
                            <img alt="" class="orgObjectAv">
                            <h3 class="orgObjectUserName">org userName</h3>
                        </div>
                    </div>
                    <!-- second sectino -->
                    <div class="currentState flex">
                        <input type="file" multiple id="current-state-imgs" name="cStateImgs">
                        <textarea name="info" id="current-state-info" cols="30" rows="10"
                            placeholder="type the current state info "></textarea>
                    </div>
                    <!-- third section -->
                    <div class="toDo flex">
        
                        <div class="maintags">
                            <select id="camp-type">
                                <option value="">نوع الحملة</option>
                                <option value="صناعة">صناعة</option>
                                <option value="صيانة">صيانة</option>
                            </select>
                            <select id="camp-prototype">
                                <option value="">خطة الحملة</option>
                                <option value="بناء">بناء</option>
                                <option value="زراعة">زراعة</option>
                                <option value="ننظيف">ننظيف</option>
                            </select>

                            <select id="time-state">
                                <option value="">الحالة الزمنية</option>
                                <option value="الان">الان</option>
                                <option value="قريبا">قريبا</option>
                                <option value="مكتملة">مكتملة</option>
                                <option value="طوال-الوقت">طوال-الوقت</option>
                            </select>
                                    </div>
        
                        <div class="todo-info flex">
                            <input type="file" multiple id="todo-imgs" name="todoImgs">
                            <textarea name="info" id="todo-info" cols="30" rows="10"
                                placeholder="type what to do; steps"></textarea>
                        </div>

                        <div class="todotags">
                        
                            <select id="base-location">
                                <option value="">المحافظة</option>
                                <option value="بغداد">بغداد</option>
                                <option value="البصرة">البصرة</option>
                                <option value="نينوى">نينوى</option>
                                <option value="اربيل">اربيل</option>
                            </select>
                            <input type="text" placeholder="قضاء: ناحية: ..." id="location">


                            <input type="date" name="" id="camp-time" placeholder="camp time">
                        </div>
                    </div>
        
                    <!-- fourth section -->
                    <div class="requirements flex">
                        <textarea name="skills" id="skills" cols="30" rows="10" placeholder="skills;number"></textarea>
                        <textarea name="knowledge" id="knowledge" cols="30" rows="10" placeholder="knowledge;number"></textarea>
                        <textarea name="tools" id="tools-materials" cols="30" rows="10" placeholder="tools;number"></textarea>
                        <input type="text" name="" id="donation" placeholder="donation">
                    </div>
                    <!-- <div class="uploadDate">9.5.2021</div> -->
                </div>
        
                <button id="postCamp">post camp</button>
        
            </div>
        `
        let div = document.createElement("div")
        div.innerHTML = postMakingTemplate
        document.body.insertBefore(div, document.querySelector("footer"))

        let postBtn = document.querySelector("#postCamp")
        postBtn.disabled = true

            let post = document.querySelector(".post")
            const inputFeilds = post.querySelectorAll("input, textarea");
            console.log(inputFeilds)
            inputFeilds.forEach(e=>e.addEventListener("change",()=>{
                console.log("check if valid")
            const validInputs = Array.from(inputFeilds).filter( input => input.value !== "");

                console.log(validInputs.length)
                console.log(inputFeilds.length)

                if(validInputs.length == inputFeilds.length){postBtn.disabled = false}} ))


        postBtn.addEventListener("click", async ()=>{
            console.log("clicked make post btn")
            

            ////make the object 

            let fd = new FormData()
            let fdCImgs = new FormData()
            let fdTodoImgs = new FormData()
            
            fd.append("cStateInfo", document.querySelector("#current-state-info").value)
            fd.append("todoInfo", document.querySelector("#todo-info").value)
            fd.append("campType", document.querySelector("#camp-type").value)
            fd.append("timeState", document.querySelector("#time-state").value)
            fd.append("location", document.querySelector("#location").value)
            fd.append("campTime", document.querySelector("#camp-time").value)
            fd.append("skills", document.querySelector("#skills").value)
            fd.append("knowledge", document.querySelector("#knowledge").value)
            fd.append("toolsMaterials", document.querySelector("#tools-materials").value)
            fd.append("donation", document.querySelector("#donation").value)
            fd.append("baseLocation", document.querySelector("#base-location").value)
            fd.append("campPrototype", document.querySelector("#camp-prototype").value)


            for(let i of document.querySelector("#current-state-imgs").files){fd.append("cStateImgs", i)}
            for(let i of document.querySelector("#todo-imgs").files){fd.append("todoImgs", i)}

            // document.querySelector("#current-state-imgs").files.forEach(e=>fd.append("cStateImgs", e))
            // document.querySelector("#todo-imgs").files.forEach(e=>fd.append("todoImgs", e))


            ////send the object 
            let d = await fetch("/makePost", {
                headers: new Headers({"authorization": localStorage.getItem("token")}),
                method: "POST",
                body: fd
            })

            ////specific route for current imgs and todo imgs; 

            // let dcImgs = await fetch("/fdcImgs", {
            //     headers: new Headers({"authorization": localStorage.getItem("token")}),
            //     method: "POST",
            //     body: fdCImgs
            // })
            // let dTodoImgs = await fetch("/fdTodoImgs", {
            //     headers: new Headers({"authorization": localStorage.getItem("token")}),
            //     method: "POST",
            //     body: fdTodoImgs
            // })



            ////empty the values 
        })



        }

            ////follow; change the method; toggle; to remove 
        // function displayFollowBtn() {
        //     console.log("will display follow btn")

        //     let followOptions = {
        //         // following: JSON.parse(localStorage.getItem("cUser")).userName,
        //         following: localStorage.getItem("token"),
        //         followed: cookies.pUserName
        //     }

        //     console.log(followOptions)
        //     let followBtn = document.createElement("button")
        //     followBtn.textContent = "follow"

        //     followBtn.addEventListener("click", () => {
        //         let d = fetch("/follow", {
        //             method: "POST",
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(followOptions)
        //             // body: cookies.pUserName
        //         })
        //     })

        //     // info.append()
        //     info.insertBefore(followBtn, info.firstElementChild)


        // }

        // function displayUnfollowBtn() {
        //     console.log("will display unfollow btn")

        //     let unfollowOptions = {
        //         // following: JSON.parse(localStorage.getItem("cUser")).userName,
        //         following: localStorage.getItem("token"),
        //         followed: cookies.pUserName
        //     }

        //     console.log(unfollowOptions)
        //     let unfollow = document.createElement("button")
        //     unfollow.textContent = "unfollow"

        //     unfollow.addEventListener("click", () => {
        //         let d = fetch("/unfollow", {
        //             method: "POST",
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(unfollowOptions)
        //             // body: cookies.pUserName
        //         })
        //     })

        //     // info.append()
        //     info.insertBefore(unfollow, info.firstElementChild)

        // }

        function displayFollowingBtn(followingStatus, nextFollowingStatus) {
            console.log("will display follow btn")

            let followOptions = {
                // following: JSON.parse(localStorage.getItem("cUser")).userName,
                following: localStorage.getItem("token"),
                followed: cookies.pUserName
            }

            console.log(followOptions)
            let follow = document.createElement("button")
            follow.textContent = followingStatus

            follow.addEventListener("click", async () => {
            // follow.textContent = nextFollowingStatus

            if(follow.textContent == "follow"){follow.textContent="unfollow"}else{follow.textContent="follow"}

                console.log("clicked follow")
                let d = await fetch("/follow", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(followOptions)
                    // body: cookies.pUserName
                })
                // console.log(nextFollowingStatus)
                let pd = await d.json()
                // cUserJson
            // console.log(nextFollowingStatus)

            })

            // info.append()
            info.insertBefore(follow, info.firstElementChild)
        }

        async function checkAccount() {

            console.log(cookies)
            cUserJson = JSON.parse(localStorage.getItem("cUser"))
            // cUserJson = localStorage.getItem("cUser")

            ///////////current user type; no account, account; user; owner, not owner, org; owner, not owner
            ///not account; register and login
            if (cUserJson == undefined) { ////no account 
                regLoginPanels()
            } else { //account; 
                
            ////get cuser following
            let d = await fetch("/cfollowing", {headers: {"Authorization": localStorage.getItem("token")}})
            let pd = await d.json()

            console.log(pd.following)
            localStorage.setItem("following", pd.following)


                console.log(".....account.....")

                /////deploy the data; make the cUser object
                readCookies()
                let cUser = createUserObject()

                ///create logout button
                createLogoutBtn(cUser)

                ////puser and cuser relation 
                if (cookies.pUserName == cUserJson.userName) { //owner; edit option
                    pUserName.innerHTML += "<small> (you) </small>"

                    ///display basic editing; 
                    displayBasicEditing()

                    ///user; isUser true
                    if (cUserJson.isUser) {
                        displayUserEditing()
                    } else {
                    ///org; isUser false
                    displayOrgEditing()

                    }

                } else { //not owner; follow option
                    console.log("not the same user")
                    console.log(cUserJson.following)
                    if (localStorage.getItem("following").includes(cookies.pUserName)) {
                        displayFollowingBtn("unfollow", "follow")
                    } else {
                        displayFollowingBtn("follow", "unfollow")
                    }    
                }
            }
        }

        //main profile data (onload) 
        window.onload = async () => {

            ////insert basic info;
            let dd = await fetch("/profileData/" + window.location.pathname.split("/")[2])
            let pdd = await dd.json()

            readCookies()
            insertProfileData(pdd)
            checkAccount()

        }
        ////test code 

            ////trying to send auth header; 
            // let au = fetch("/auth",{
            //     headers: {"Authorization": "secret token"}
            // })


console.log("from profile folder")
