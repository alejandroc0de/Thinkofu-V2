// Getting the user code and name from the local storage 

document.addEventListener("DOMContentLoaded", () => {
    // LOCAL STORAGE = userCode and userName
    const userCode = localStorage.getItem("userCode")
    const userName = localStorage.getItem("userName")
    document.getElementById("welcomeMessage").textContent = `Welcome to thinkofu ${userName}`;
})

// Finding the client partner
const findPartner = document.getElementById("buttonFindPartner");
findPartner.addEventListener("click", async () => {
    const partnerCode = document.getElementById("partnerInput").value.trim();
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
            body : JSON.stringify({partnerCode : partnerCode})
        })

        // Now we check the responde from the backend
        const response = await res.json();

        if(response.success){
            // IF partner was found 
            document.getElementById("partnerInput").classList.add("no-Show")
            findPartner.textContent = `Your partner is ${response.userName}`
            findPartner.disabled = true;
        }else{
            // if partner was not found
            alert("Partner code is incorrect")
            return
        }
    }catch (err){
        console.log(err)
    }
});