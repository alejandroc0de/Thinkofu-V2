const express = require('express');
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
    
})


app.listen(2000, () => {
    console.log("Server runnin in port 3000")
})