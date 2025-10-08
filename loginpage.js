
// Action Listener for SUBMIT LOGIN INFO
// we await the response from the login function to the backend
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", async() => {
    const userCode = document.getElementById("codeInput").value.trim();
    const userPassword = document.getElementById("passwordInput").value.trim();
    
    // Checking if fields are empty 

    if(!userCode||!userPassword){
        alert("Fill both fields")
        return
    }
    else{
        await loginUser(userCode,userPassword)
    }
});

// Action listener for REGISTER NEW USER
const registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", () => {
    window.location.href = "register.html";
});


// Function to call backend and check user code 
async function loginUser(userCode,userPassword){
    try{
        const res = await fetch ("/checkuser", {
            // We have to send the method, type of data, and the data itself (Used json to send it)
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({code : userCode, password : userPassword})
        });
        const data = await res.json();
        if(data.success){
            window.location.href = "mainWindow.html"
        }else{
            alert(data.message);
        }

    }catch(err){
        console.log("Error when trying to login" + err)
    }
}