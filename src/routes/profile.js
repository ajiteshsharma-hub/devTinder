const express = require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth"); //
const {validateUserProfile, validateUserPassword, isStrongPassword} = require("../utils/validation");


profileRouter.get("/profile/view", userAuth, async(req, res) => {
   try{
        const user = req.user;
        res.send(user);
   }
   catch(err){
        console.error("Error fetching profile data", err);
        res.status(400).send("Error fetching profile data" + err.message);
   }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateUserProfile(req)){
            throw new Error("Invalid edit request")
        };

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        
        res.json({message: `${loggedInUser.firstName}, your profile has been updated!`, data: loggedInUser});

    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit/password", userAuth, async(req, res) => {
    try{
        //fetching old hashed password from the user
        const loggedInUser = req.user;
        const existingPassword = loggedInUser.password;

        //checking if the password is valid or not
        const isPasswordValid = await validateUserPassword(req, existingPassword);
        if(!isPasswordValid){
            throw new Error("You have entered wrong password!")
        };

        //checking if the password is strong enough or not
        const strongPassword = isStrongPassword(req);
        if(!strongPassword){
            throw new Error("Please enter a strong password!");
        };
        
        //Hashing the new password
        const {newPassword} = req.body;
        const passwordHash = await bcrypt.hash(newPassword, 10);

        //Replacing the old hashed password with the new hashed password
        loggedInUser.password = passwordHash;

        //saving the data to the database
        await loggedInUser.save();

        res.send({message: `${loggedInUser.firstName}, your password has been updated`, data: loggedInUser});
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = profileRouter;