const express = require('express');

const app = express(); //Create an instance of the express application

const {connectDB} = require("./config/database"); //Importing the database configuration to establish a connection with the database

const User = require("./models/user"); //Importing the User model to interact with the user collection in the database

app.use(express.json()); //Middleware to parse incoming JSON requests and make the data available in req.body

app.post("/signUp", async(req, res) => {
    const data = req.body;

    //Creating a new user instance using the data from the request body
    const user = new User(data);

    
    try{
        const allowedFields = ["firstName", "lastName", "email", "userName", "password", "age", "gender", "photoURL", "about", "skills"];
        const isValidField = Object.keys(data).every((field) => allowedFields.includes(field));
    
        if(!isValidField){
            throw new Error("Entered invalid field!");
        }
        await user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user");
    }
});

// Get user by emailID
app.get("/user", async(req, res) => {
    const userEmail = req.body.email; // Assuming the email is sent in the request body
    try{
        const user = await User.find({email: userEmail});

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

//Feed API get all users from the database
app.get("/feed", async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Error fetching user data");
    }
});

//Delete user by ID
app.delete("/user", async(req, res) => {
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

//Update user data by ID
app.patch("/user", async(req, res) => {
    const userId = req.body.userId; // Assuming the user ID is sent in the request body

    const data = req.body;

    try{
        const allowedUpdates = ["lastName", "password", "gender", "about", "skills", "photoURL"];
        const isUpdateAllowed = Object.keys(data).every((update) => allowedUpdates.includes(update));

        if(!isUpdateAllowed){
            throw new Error("You can't update this field");
        };

        if(data?.skills.length > 10){
            throw new Error("You can add maximum 10 skills");
        };

        const updatedUser = await User.findByIdAndUpdate({_id: userId}, data, {
            new : true, // Return the updated document
            runValidators: true, // Run schema validators on the update operation
            returnDocument: "after" // Return the updated document instead of the original document
        });

        //const updatedUser = await User.findByIdAndUpdate(userId, data);
        
        res.send("User data updated successfully");
    }
    catch(err){
        res.status(400).send("Update failed!" + err.message);
    }       
});

connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed", err);
    });

//Middleware function to handle incoming requests and send a response
app.get("/test", (req, res) => {
    res.send('Server is working!');
});

