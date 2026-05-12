const express = require('express');

const app = express(); //Create an instance of the express application

const {connectDB} = require("./config/database"); //Importing the database configuration to establish a connection with the database

const User = require("./models/user"); //Importing the User model to interact with the user collection in the database

app.post("/signUp", async(req, res) => {
    const user = new User({
        firstName: "Ajitesh",
        lastName: "Sharma",
        email: "ajitesh2405sharma@gmail.com",
        userName: "ajitesh.sharma",
        password: "ajitesh1234",
        age: 24,
        gender: "Male",
        city: "Bhopal"
    });
    try{
        await user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user");
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

