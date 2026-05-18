const express = require('express');
const userRouter = express.Router();
const User = require("../models/user"); //Importing the User model to interact with the user collection in the database
const {userAuth} = require("../middlewares/auth"); //

//Feed API get all users from the database
userRouter.get("/feed", userAuth,  async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Error fetching user data");
    }
});

// Get user by emailID
userRouter.get("/user", async(req, res) => {
    const userEmail = req.body.email; // Assuming the email is sent in the request body
    try{
        const user = await User.find({email: userEmail}); //This will return an array of user documents that match the email

        // const user = await User.findOne({email: userEmail}); // Using findOne to get a single user document instead of an array

        if(user.length === 0){
            res.status(404).send("User not found");
            return;
        }
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error fetching user data");
    }
});

//Delete user by ID
userRouter.delete("/user", userAuth, async(req, res) => {
    const userId = req.body.userId; // Assuming the user ID is sent in the request body

    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        //const deletedUser = await User.findByIdAndDelete({_id : userId}); 
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Error deleting user");
    }
});


module.exports = userRouter;