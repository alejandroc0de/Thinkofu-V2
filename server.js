const express = require('express');
const bcrypt = require("bcrypt"); // module to encrypt password 
const app = express();
const PORT = 3000;
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use(express.static('public')); // Serves all the files in the directory 
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


// Post to REGISTER USER 
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
        console.log("Error when registering",err);
        res.status(500).json({success: false, message: "Error when registering user"})
    }
});



// Post to CHECK USER 
app.post('/checkuser', async(req,res) => {
    const{code,password} = req.body; // We read the body of the json sent
    try{
        console.log(code,password)
        const result = await pool.query(
            'SELECT * FROM users WHERE code = $1',
            [code]
        );
        if(result.rows.length === 0){
            console.log("User not found")

        }else{
            console.log("User found!")
            const userData = result.rows[0];
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                res.json({ success: true, message:"Correct!", userCode: code, userName: userData.name});
            }else{
                console.log("password incorrect")
                res.json({success:false, message:"Incorrect password"})
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Error").json({success:false,message:"Error when signing in"})
    }
});


// POST TO FIND PARTNER 
app.post('/findPartner', async(req,res) => {
    const {partnerCode,currentUser} = req.body;
    // We receive the partnerCode from the frontend, we have to receive the current user code and also his partner
    try{
        console.log(partnerCode)
        // We extract the data of both partners using their ids from the frontend 
        const partner = await pool.query(
            'SELECT * FROM users WHERE code = $1',
            [partnerCode]
        );
        const current = await pool.query(
            'SELECT * FROM users WHERE code = $1',
            [currentUser]
        );

        // IF partner is not found 
        if(partner.rows.length === 0){
            console.log("PartnerCode is incorrect")
            res.json({success: false, message: "Incorrect code"})
        }
        else{
            console.log("User found")
            const partnerData = partner.rows[0]
            const currentUserData = current.rows[0]
            // Lets update the client profile to add his partner 
            // lets set current user
            await pool.query(
                "UPDATE users SET partner_id = $1 WHERE id = $2",
                [partnerData.id,currentUserData.id]
            );
            // Now the partner
            await pool.query(
                "UPDATE users SET partner_id = $1 WHERE id = $2",
                [currentUserData.id,partnerData.id]
            );          
            const roomId = [currentUserData.id,partnerData.id].sort().join("-"); // create room id 
            await pool.query(
                "UPDATE users SET room_id = $1 WHERE id = $2",
                [roomId,currentUserData.id]
            )
            await pool.query(
                "UPDATE users SET room_id = $1 WHERE id = $2",
                [roomId,partnerData.id]
            )

            res.json({success: true, message: "Partner Found and linked!", userCode : partnerData.code, userName: partnerData.name})
            console.log("Partners were linked succesfully")
        }
    }catch(err){
        console.log("Error when trying to find partner " + err)
        res.status(500).json({success:false , message : "Server error when linking partners"})
    }
});

// POST TO CHECK IF USER HAS PARTNER ON START UP
app.post('/checkPartner', async(req,res) => {
    const {userCode} = req.body;
    try{
        // Asking DB for user Data
        const response = await pool.query(
            'SELECT * FROM users WHERE code = $1',
            [userCode]
        );
        const userData = response.rows[0]
        if(!userData.partner_id){
            // Doesnt have a partner yet
            return res.json({success: true, hasPartner: false})
        }
        // Check partner name and code to return
        const partnerId = userData.partner_id;
        const partner = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [partnerId]
        );
        const partnerData = partner.rows[0];
        res.json({success:true, hasPartner: true, message: "Client has a partner", partnerName: partnerData.name, partnerCode:partnerData.code})
    }catch(err){
        console.error("Error when retriving partner info",err)
        res.status(500).json({success:false, message : "Server error when checking for partner"})
    }
});

//POST TO SAVE THINKFOFUS 
app.post('/saveThink', async(req,res) => {
    const {userCode} = req.body;
    try{
        
    }catch(err){

    }
})

app.listen(2000, () => {
    console.log("Server runnin in port 3000")
});