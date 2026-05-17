const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");


const userAuth = async(req, res, next) => {
    try{
        //reading the cookie and extracting the token from the cookie
        const cookies = req.cookies;
        const{token} = cookies;
        if(!token){
            throw new Error("Please login again!");
        }

        //validate the cookie
        const decodedToken = jwt.verify(token, "secretKey");  // Verifying the JWT token using the jsonwebtoken library to ensure that the token is valid and has not been tampered with, using the same secret key that was used to sign the token during login
        const{_id} = decodedToken;  // Extracting the user ID from the decoded token to identify the user making the request and retrieve their profile information from the database

        //fetch the user
        const user = await User.findById(_id); // Fetching the user document from the database using the extracted user ID to retrieve the user's profile information and send it back in the response
        if(!user){
            throw new Error("User not found!");
        }

        req.user = user;
        //move to the request handler after authentication
        next();
    }
    catch(err){
        console.error(err);
        res.status(400).send("Error: " + err.message);
    }
};

module.exports = {
    userAuth
}