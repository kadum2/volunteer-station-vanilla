
        
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

        // userRegisterBtn.style.background = "red"
        ////// data containers

        let currentUser
        let token
        let postsArray
        let filtered = []

        // .prototype.forEach = Array.prototype.forEach

        /////the filters 
        let filters = document.querySelector("#main-filters")
        console.log(filters.children)
        for(let item of filters.children){
            console.log(item)
            
                item.addEventListener("change", (e)=>{
                    console.log("changed filter value ")
                    console.log(e.target.value)
                    // postsArray.forEach(i=>
                    // filtered.push(postsArray.filter(i[item.getAttribute("id")]==
                    // e.target.value)))
                    filtered = postsArray.filter(i=> i[item.getAttribute("id")] == e.target.value)
                    console.log(filtered)
                    makingPosts(filtered)
                })
            
        }
        // [].forEach.call(filters.children, )
        // filters.children.forEach(e=>{
        //     e.addEventListener("change", ()=>{
        //         makingPosts(postsArray.forEach(i=> postsArray.filter(i[e.getAttribute("id")]== e.target.value)))
        //     })
        // })

        let timeState = document.querySelector("#timeState")
        let campLocation = document.querySelector("#location")
        let campType = document.querySelector("#campType")
        let campPrototype= document.querySelector("#campPrototype")
        let skills = document.querySelector("#skills")
        let knowledge = document.querySelector("#knowledge")
        let toolsMaterials = document.querySelector("#toolsMaterials")


        // timeState.addEventListener("change", (e)=>{
        //     console.log(e.target.value)
        //     console.log(postsArray)
        //     console.log(postsArray.filter(i=>i[`${timeState.getAttribute("id")}`] == e.target.value))
        // })



        ///////
        function makingPosts(postsArray){

            console.log(postsArray)
            document.querySelector("#cont-cont").innerHTML = ""
            
            postsArray.forEach(e => {
                console.log(e)
            let postTemplate = `<div class="post">
            <!-- first seciton -->
            <div class="postHeader flex">
                <div class="orgObject flex">
                    <img alt="" class="orgObjectAv" style="
                        background: url(${e.avatar};background-size: cover;background-position: center center;
                        height: 2rem;
                        width: 2rem; )">
                    <h3 class="orgObjectUserName">${e.userName}</h3>
                </div>
            </div>
            <!-- second sectino -->
            <div class="currentState flex">
                <div class="current-state-imgs flex">
                ${e.cStateImgs.map(e=>  `<img style="background:url('../posts/${e}');        
                background-size: cover;
                background-position: center center;
        ">`).join('')}
                </div>
                <div class="info flex">${e.cStateInfo}</div>
            </div>
            <!-- third section -->
            <div class="todo flex">
                <div class="maintags">
                    <span class="camp-type">${e.campType}</span>
                    <span class="time-state">${e.timeState}</span>
                </div>

                    <div class="todo-imgs flex">
                    ${
                        e.todoImgs.map(e=>{
                        console.log(e)
                        return `<img style="background:url('../posts/${e}');
                        background-size: cover;
                        background-position: center center;
                ">`}).join('')}
                    </div>
                    <div class="info flex">${e.todoInfo}</div>

                <div class="todotags">
                    <span class="location">${e.location}</span>
                    <span class="camp-time">${e.campTime}</span>
                </div>
            </div>

            <!-- fourth section -->
            <div class="requirements flex">
                <span>${e.skills}; x/x</span>
                <span>${e.knowledge}; x/x</span>
                <span>${e.toolsMaterials}; x/x</span>
                <h3>المبلغ المطلوب; ${e.neededDonation} </h3>
                <h3>المبلغ الحالي; ${e.currentDonation} </h3>
            </div>
            <div class="uploadDate">وقت الرفع: ${e.dataOfUpload}</div>
        </div>
`
                        let postToAdd = document.createElement("div")
                        postToAdd.innerHTML = postTemplate
                document.querySelector("#cont-cont").append(postToAdd)

            });


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







