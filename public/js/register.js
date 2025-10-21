const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async () => {
    const nameUser = document.getElementById("name").value
    const passwordUser = document.getElementById("password").value
    console.log(nameUser,passwordUser)

    if(!nameUser || !passwordUser){
        alert("Fill all the needed information")
        return;
    }

    // We send the user and passcode to the backend

    try{
        const res = await fetch("/registerUser",{
            // Again we use a POST method to send the data using JSON
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({nameUser : nameUser, passwordUser : passwordUser})
        })
        // We await for the response from the server 
        // Has to return the code assigned at the server
        const data = await res.json();
        alert(`You have been registered, please write down your code: ${data.code}`)
        console.log(data) // PRINTING DATA RETURNED FROM SERVER 
        window.location.href = "index.html"

    }catch(err){
        console.log(`Error al enviar register info to the server: ${err}`)
    }

});