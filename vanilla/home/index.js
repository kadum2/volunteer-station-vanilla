        ////// dom elements  
        ////templates
        let relatedAccounts = document.querySelector("#relatedAccounts")

        //register
        let registerEm = document.querySelector("#registerEm")
        let registerPw = document.querySelector("#registerPw")
        let userRegisterBtn = document.querySelector("#userRegister")
        let orgRegisterBtn = document.querySelector("#orgRegister")

        //login
        let loginEm = document.querySelector("#loginEm")
        let loginPw = document.querySelector("#loginPw")
        let loginBtn = document.querySelector("#login")

        ////filters no ndeed ?
        let timeState = document.querySelector("#timeState")
        let campLocation = document.querySelector("#location")
        let campType = document.querySelector("#campType")
        let campPrototype= document.querySelector("#campPrototype")
        let skills = document.querySelector("#skills")
        let knowledge = document.querySelector("#knowledge")
        let toolsMaterials = document.querySelector("#toolsMaterials")

        let allBtn = document.querySelector("#all")
        allBtn.addEventListener("click", ()=>makingPosts(postsArray))

        ////// data containers

        let currentUser
        let token
        let postsArray
        let contributer = false
        // span or tag.addeventlistener("click", e=>fetch("/contri", {method:
        // "POST", body: e.target.value}))

        // .prototype.forEach = Array.prototype.forEach

        let filters = document.querySelectorAll("select")
        console.log(filters)
        for(let item of filters){
                item.addEventListener("change", (e)=>{
                    console.log(postsArray.filter(i=> i[item.getAttribute("id")] == e.target.value))
                    makingPosts(postsArray.filter(i=> i[item.getAttribute("id")] == e.target.value))
                })
            
        }

        ///////
        function makingPosts(postsArray){

            console.log(postsArray)
            document.querySelector("#postsFeed").innerHTML = ""
            
            postsArray.forEach(e => {
                console.log(e)
            let postTemplate = `
            <div class="post">
            <!-- first seciton -->
            <div class="postHeader flex">
                <div class="accountObject flex">
                    <img alt="" class="orgObjectAv" style="
                        background: url(${e.avatar};background-size: cover;background-position: center center;
                        height: 2rem;
                        width: 2rem; )">
                    <h3 class="orgObjectUserName">${e.userName}</h3>
                </div>
            </div>
            <!-- second sectino -->
            <div class="currentState flex">
            الوضع الحالي

                <div class="info flex">${e.cStateInfo}</div>
                <div class="imgs flex">
                ${e.cStateImgs.map(e=>  `<img style="background:url('../posts/${e}');        
                background-size: cover;
                background-position: center center;">`).join('')}
                </div>
            </div>
            <!-- third section -->
            <div class="todo flex">
            للقيام به

                <div class="mainTags">
                    <span class="campPrototype">${e.campPrototype}</span>
                    <span class="campType">${e.campType}</span>
                    <span class="timeState">${e.timeState}</span>
                </div>
                    <div class="info flex">${e.todoInfo}</div>

                    <div class="imgs flex">
                    ${
                        e.todoImgs.map(e=>{
                        console.log(e)
                        return `<img style="background:url('../posts/${e}');
                        background-size: cover;
                        background-position: center center;">`}).join('')}
                    </div>

                <div class="todoTags">
                <span class="baseLocation">${e.baseLocation}</span>                    
                    <span class="location">${e.location}</span>
                    <span class="campTime">${e.campTime}</span>
                </div>
            </div>

            <!-- fourth section -->
            <div class="requirements flex">
                <div class="req-tags flex">
                    <span id="skills-tag" class="flex">skills; 
                        <span>${e.skills}; x/x</span>
                    </span>
                    <span id="knowledge-tag" class="flex">knowledge; 
                        <span>${e.knowledge}; x/x</span>
                    </span>
                    <span id="tools-materials-tag" class="flex">tools and materials
                        <span>${e.toolsMaterials}; x/x</span>
                    </span>

                </div>
                <div class="dona flex">
                    <span>المبلغ المطلوب; ${e.neededDonation} </span>
                    <span>المبلغ الحالي; ${e.currentDonation} </span>
                </div>
            </div>
            <div class="uploadDate">قبل  ${e.dataOfUpload - Date.now()}</div>
            <div class="uploadDate">وقت الرفع: ${e.dataOfUpload}</div>

            </div>
`
                        let postToAdd = document.createElement("div")
                        postToAdd.innerHTML = postTemplate
                document.querySelector("#postsFeed").append(postToAdd)
            });
        }


        /////functions; 
        async function regLoginPanels(){
            console.log("no user; should generate the auth")
            document.querySelector("#conts").innerHTML += ` 
            <div id="regLogPanel">           
                <div id="registerPanel">
                    <b>register</b>
                    <input id="registerUserName" type="text" placeholder="username">
                    <input id="registerEm" type="email" placeholder="email">
                    <input id="registerPw" type="text" placeholder="password">
                    <button id="regBtn">user register</button>
                </div>
                <div id="loginPanel">
                    <b>login</b>
                    <input id="loginEm" type="email" placeholder="email">
                    <input id="loginPw" type="text" placeholder="password">
                    <button id="loginBtn">login</button>
                </div>
            </div>`

            ////register
            let register = document.querySelector("#registerPanel")
            let registerEm = document.querySelector("#registerEm")
            let registerPw = document.querySelector("#registerPw")
            let regiseterUn = document.querySelector("#registerUserName")
            let regBtn = document.querySelector("#regBtn")

            ////login
            let login = document.querySelector("#loginPanel")
            let loginEm = document.querySelector("#loginEm")
            let loginPw = document.querySelector("#loginPw")
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
                    checkAccout()
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
                    checkAccout()

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
                    checkAccout()
                })
                document.querySelector("#cUserTemplate").append(cUser, logoutBtn)
                relatedAccounts.innerHTML = ""
            }



        /////account checking; 
        cUserJson = JSON.parse(localStorage.getItem("cUser"))

        ///not account; register and login
        if (cUserJson == undefined) { ////no account 
            regLoginPanels()
        }else{
            console.log("account is; " + cUserJson.userName)
            
            /////make the cUser object
            let cUser = createUserObject()

            ///create logout button
            createLogoutBtn(cUser)


        }



        ////// getting data 

        window.onload = async () => {
            let d = await fetch("/posts")
            let pd = await d.json()

            console.log(pd)
            postsArray = pd.posts

            ////making posts 
            makingPosts(postsArray)
        }




        /////features 







