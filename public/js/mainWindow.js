let userCode
let userName
const findPartner = document.getElementById("buttonFindPartner");
const partnerInput = document.getElementById("partnerInput");
const logoutButton = document.getElementById("logoutButton");
const thinkofuButton = document.getElementById("thinkofuButton")
const refreshRecentBox = document.getElementById("refreshRecentBox")
const recentBox = document.getElementById("recentBox")

// Getting the user code and name from the local storage 
// Also checking if client has partner

document.addEventListener("DOMContentLoaded", async () => {
    // LOCAL STORAGE = userCode and userName
    userCode = localStorage.getItem("userCode")
    userName = localStorage.getItem("userName")
    document.getElementById("welcomeMessage").textContent = `Welcome to thinkofu ${userName}`;
    // WE check ON START UP if client has a partner 
    try{
        const res = await fetch("/checkPartner", {
            method: "POST",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify({userCode:userCode})
        });

        // Response from backend
        const response = await res.json();
        if(response.hasPartner){
            //Client has a partner 
            partnerInput.classList.add("no-Show")
            findPartner.textContent = `Your partner is ${response.partnerName}`
            findPartner.disabled = true;
        }
    }catch(err){
        console.log("Error when checking for partner on startup", err)
    }
})


// Finding the client partner
findPartner.addEventListener("click", async () => {
    if(findPartner.disabled) return; // Disable all the input logic
    const partnerCode = partnerInput.value.trim();
    //CALLING BACKEND 
    if(!partnerCode){
        alert("Enter a partner code");
        return
    }
    try{
        const res = await fetch("/findPartner", {
            // We use POST to send the code to the backend and check partner
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body : JSON.stringify({partnerCode : partnerCode, currentUser: userCode})
        });

        // Now we check the responde from the backend
        const response = await res.json();

        if(response.success){
            // IF partner was found 
            partnerInput.classList.add("no-Show")
            findPartner.textContent = `Your partner is ${response.userName}`
            findPartner.disabled = true;
        }else{
            // if partner was not found
            alert("Partner code is incorrect")
            return
        }
    }catch (err){
        console.log("Error when trying to save partner info" , err)
    }
});

// Saving messages
thinkofuButton.addEventListener("click", async() => {
    userCode = localStorage.getItem("userCode")
    try {
        const res = await fetch("/saveThink", {
            method: "POST",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify({userCode:userCode})
        });
        const response = await res.json()
        console.log(response.message)
        refreshRecentBox.click()
    } catch (err) {
        console.log(err)
    }
})

//RecentBox 
refreshRecentBox.addEventListener("click", async() => {
    userCode = localStorage.getItem("userCode")
    try{
        const res = await fetch("/refreshBox", {
            method: "POST",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify({userCode:userCode})
        });
        const response = await res.json()
        console.log(response.message)
        recentBox.innerHTML = ''
        response.message.forEach(message => {
            const messageDiv = document.createElement("div")

            // FORMATING FOR NICE TIME SHOWING 
            const date = new Date(message.sent_at);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;

            messageDiv.textContent = `Time = ${formatted} : ${message.content} by ${message.sender_code}`
            recentBox.appendChild(messageDiv)
        });
    }catch(err){
        console.log(err)
    }
})

//Logout Logic
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("userCode")
    localStorage.removeItem("userName")
    window.location.href = "/index.html"
})


// TO DO :
