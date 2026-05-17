const express = require('express');
const bcrypt = require('bcrypt');// Importing bcrypt library for hashing passwords before storing them in the database
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken library for generating and verifying JSON Web Tokens for user authentication
const cookieParser = require('cookie-parser'); // Importing cookie-parser middleware to parse cookies in incoming requests
const app = express(); //Create an instance of the express application
const {connectDB} = require("./config/database"); //Importing the database configuration to establish a connection with the database
const {validateSignUpData} = require("./utils/validation"); //Importing the validation function to validate the user input data during sign up process
const User = require("./models/user"); //Importing the User model to interact with the user collection in the database
const {userAuth} = require("./middlewares/auth"); //

//Middlewares
app.use(express.json()); //Middleware to parse incoming JSON requests and make the data available in req.body
app.use(cookieParser()); //Middleware to parse cookies in incoming requests and make them available in req.cookies

//API Calls
app.post("/signUp", async(req, res) => {

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

//Login API
app.post("/login", async(req, res) => {
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

            res.send("Login successful");
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

//Profile API
app.get("/profile", userAuth, async(req, res) => {
   try{
        const user = req.user;
        res.send(user);
   }
   catch(err){
        console.error("Error fetching profile data", err);
        res.status(400).send("Error fetching profile data" + err.message);
   }
});
 
// Get user by emailID
app.get("/user", async(req, res) => {
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

//Feed API get all users from the database
app.get("/feed", userAuth,  async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Error fetching user data");
    }
});

//Delete user by ID
app.delete("/user", userAuth, async(req, res) => {
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
app.patch("/user", userAuth, async(req, res) => {

    const {userId, ...data} = req.body;

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

app.post("/sendConnectionRequest", userAuth, async(req, res) => {
    const user = req.user;

    console.log("Sending connection request");
    res.send(user.firstName + " sent a connection request");
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

