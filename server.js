const express = require('express');
const bcrypt = require("bcrypt"); // module to encrypt password 
const app = express();
const PORT = 3000;
app.use(express.static(__dirname)); // Serves all the files in the directory 
app.use(express.json()); // We let server know we will send json to parse back to js

// Postgres Setup

const{Pool} = require('pg');
const pool = new Pool({
    user: 'alejandrocarrillo',
    host: 'localhost',
    database: 'thinkofu',
    password : '',
    port: 5432,
});

app.post('/registerUser', async(req,res) => {

    const {nameUser, passwordUser} = req.body;

    // function to create Usercode 
    const generateCode = (nameUser) => {
        const initials = nameUser.slice(0,3).toUpperCase();
        const random = Math.floor(1000+Math.random()*9000);
        return `${initials}-${random}`
    }


    try{
        const code = generateCode(nameUser);
        const hashedPassword = await bcrypt.hash(passwordUser,10)

        const querydb = await pool.query(
            "INSERT INTO users(code,name,password) VALUES ($1,$2,$3) RETURNING id,code,name,password",[code,nameUser,hashedPassword]
        );
        console.log("Usuario en db es ", querydb.rows[0]) // we print what was saved

        res.json({ success: true, code}); // We return the code to use it in the frontend

    }catch(err){
        console.log("Error al registrar usuario",err);
        res.status(500).json({success: false, message: "Error al registrar usuario"})
    }
});




app.post('/checkuser', async(req,res) => {
    const{code,password} = req.body; // We read the body of the json sent
    try{
        console.log(code,password)
        const result = await pool.query(
            'SELECT * FROM users WHERE code = $1',
            [code]
        );
        if(result.rows.length === 0){
            console.log("usuario no encontrado")

        }else{
            console.log("User encontrado")
            console.log(result.rows)
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Error")
    }
    
});


app.listen(2000, () => {
    console.log("Server runnin in port 3000")
});