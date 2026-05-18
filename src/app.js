const express = require('express');
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken library for generating and verifying JSON Web Tokens for user authentication
const cookieParser = require('cookie-parser'); // Importing cookie-parser middleware to parse cookies in incoming requests
const app = express(); //Create an instance of the express application
const {connectDB} = require("./config/database"); //Importing the database configuration to establish a connection with the database

//Middlewares
app.use(express.json()); //Middleware to parse incoming JSON requests and make the data available in req.body
app.use(cookieParser()); //Middleware to parse cookies in incoming requests and make them available in req.cookies

//Importing all the routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

