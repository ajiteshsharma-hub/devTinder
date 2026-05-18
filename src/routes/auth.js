const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation"); //Importing the validation function to validate the user input data during sign up process
const User = require("../models/user"); //Importing the User model to interact with the user collection in the database
const bcrypt = require('bcrypt');// Importing bcrypt library for hashing passwords before storing them in the database

authRouter.post("/signUp", async(req, res) => {

    try{
        validateSignUpData(req);

        const {firstName, lastName, email, password, gender, userName} = req.body; // Destructuring the required fields from the request body to create a new user instance and store it in the database

        const passwordHash = await bcrypt.hash(password, 10); // Hashing the password using bcrypt with a salt rounds of 10

        //Creating a new user instance using the data from the request body
        const user = new User({firstName, lastName, email, password: passwordHash, gender, userName});


        const allowedFields = ["firstName", "lastName", "email", "userName", "password", "age", "gender", "photoURL", "about", "skills", "city"];
        const isValidField = Object.keys(req.body).every((field) => allowedFields.includes(field));
    
        if(!isValidField){
            throw new Error("Entered invalid field!");
        }
        await user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user " + err.message);
    }
});

authRouter.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordMatch = await user.validatePassword(password); // Comparing the entered password with the hashed password stored in the database using bcrypt's compare function
        if(isPasswordMatch){
            //Create a JWT token
            const token = await user.getJWT(); // Generating a JSON Web Token (JWT) using the jsonwebtoken library, where the payload contains the user's ID and a secret key is used to sign the token for authentication purposes

            //Attach the token to the cookie and send it back to the client with the response
            res.cookie("token", token); // Accessing the cookies object from the response to set a cookie for the user session

            res.send("Login successful!");
        }
         else {
            throw new Error("Invalid credentials");
        }
    }
    catch(err){
        console.error(err)
        res.status(400).send("Error logging in user " + err.message);
    }

});

authRouter.post("/logout", async(req,res) => {

    res.cookie("token" , null , {expires: new Date(Date.now())});
    res.send("Logged out successfully");

});

module.exports = authRouter;