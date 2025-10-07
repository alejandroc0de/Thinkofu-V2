const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname)); // Serves all the files in the directory 
app.use(express.json()); // We let server know we will send json to parse back to js




app.post('/checkuser', async(req,res) => {
    const{code,password} = req.body; // We read the body of the json sent
    try{
        console.log(code,password)
        res.send("Correcto")
    }catch(err){
        console.log(err)
        res.status(500).send("Error")
    }
    
})


app.listen(2000, () => {
    console.log("Server runnin in port 3000")
})