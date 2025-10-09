// Getting the user code and name from the local storage 

document.addEventListener("DOMContentLoaded", () => {
    const userCode = localStorage.getItem("userCode")
    const userName = localStorage.getItem("userName")
    document.getElementById("welcomeMessage").textContent = `Welcome to thinkofu ${userName}`;
})
