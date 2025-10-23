let userCode
let userName
const findPartner = document.getElementById("buttonFindPartner");
const partnerInput = document.getElementById("partnerInput");
const logoutButton = document.getElementById("logoutButton");
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

//Logout Logic
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("userCode")
    localStorage.removeItem("userName")
    window.location.href = "/index.html"
})


// TO DO :
// If cx logs out we have to clear localstorage 