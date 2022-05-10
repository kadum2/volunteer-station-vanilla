        
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
            let d = await fetch("/posts")
            let pd = await d.json()

        }




        /////features 







