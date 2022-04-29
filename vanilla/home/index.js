        
        ////// dom elements
        let auth = document.querySelector("#auth")
        let relatedAccounts = document.querySelector("#relatedAccounts")

        //register
        let registerEm = document.querySelector("#register-em")
        let registerPw = document.querySelector("#register-pw")
        let userRegisterBtn = document.querySelector("#user-register")
        let orgRegisterBtn = document.querySelector("#org-register")

        //login
        let loginEm = document.querySelector("#login-em")
        let loginPw = document.querySelector("#login-pw")
        let loginBtn = document.querySelector("#login")

        userRegisterBtn.style.background = "red"
        ////// data containers

        let currentUser
        let token


        ////// getting data 

        window.onload = async () => {
            let d = await fetch("/orgs")
            let pd = await d.json()

        }

        ////////functionalities


        ///account and auth stuff; 
        ///user register
        userRegisterBtn.addEventListener("click", async () => {
            console.log(registerEm.value)
            console.log(registerPw.value)

            ///check if exist
            if (registerEm && registerPw) {

                ///make the object data to be send 
                let newUser = {
                    em: registerEm.value,
                    pw: registerPw.value
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
                ///deploy the received data; may use a function
                auth.innerHTML = `em: ${pd.em}, pw${pd.pw}`

                ///empty the values
                registerEm.value = ""
                registerPw.value = ""
            }
        })

        function clearAccountPs() {
            relatedAccounts.innerHTML = ""
        }

        ///user login; 
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
                ///deploy the received data; may use a function
                auth.innerHTML = `em: ${pd.user.em}, pw; ${pd.user.pw}`

                // let currentUser 
                // let currentUserToken = pd.token
                token = pd.token

                ///empty the values
                loginEm.value = ""
                loginPw.value = ""
            }
        })


        let profileBtn = document.querySelector("#profile-btn")
        // profileBtn.addEventListener("click", async () => {
        //     let d = await fetch("/profile", {
        //         headers: new Headers({
        //             'Authorization': 'berear ' + token,
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         }),

        //         method: "POST",

        //     })
        // })


        profileBtn.addEventListener("click", async () => {
            fetch(`/profile/${"someone"}`)
        })

        ///check if the user is loged in (token exist); may read the cookie or so??
