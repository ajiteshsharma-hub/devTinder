const express = require('express');

const app = express(); //Create an instance of the express application

//Middleware function to handle incoming requests and send a response
app.get("/test", (req, res) => {
    res.send('Server is working!');
});

// app.get("/user", (req, res) => {
//     res.send({firstName: "Ajitesh", lastName: "Sharma"});
// });


// app.get("/user/:userId/:userName", (req, res) => {
        // : means that userId and userName are route parameters that can be accessed using req.params,
        //  it is a dynamic route that can handle requests with different userId and userName values
//     console.log(req.query); //Accessing query parameters from the request
//     console.log(req.params); //Accessing route parameters from the request
//     res.send({firstName: "Ajitesh", lastName: "Sharma"});

// });


// app.post("/user", (req, res) => {
//     //Saving data to database
//     res.send("Data has been saved to the database");
// });


// app.delete("/user", (req, res) => {
//     //Deleting data from database
//     res.send("Data has been deleted from the database");
// });


const {adminAuth, userAuth} = require("./middlewares/auth");

app.post("/user/login", (req, res) => {
    res.send("User logged in successfully");
});

app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res) => {
    res.send("admin data fetched successfully")
});

app.use("/admin/deleteAllData", (req, res) => {
    res.send("Admin data is deleted successfully")
});

app.use("/user", userAuth, (req, res) => {
    res.send("User data sent successfully")
})


// app.get("ab ? c", (req, res) => {
//     res.send("ab?c");
// });

// app.get("ab+c", (req, res) => {
//     res.send("ab+c");
// });

// app.get("ab*c", (req, res) => {
//     res.send("ab*c");
// });

// app.get("ab(cd)?e", (req, res) => {
//     res.send("ab(cd)?e");
// });

// app.get(/a/, (req, res) => {
//     res.send("/a/");
// });

// app.get(/.*fly$/, (req, res) => {
//     res.send("/.*fly$/");
// }); 


//route handling with multiple route handlers

//middleware

//app.use("/user") => middleware => request handlers

//middleware functions are functions that have access to the request object (req), 
//the response object (res), and the next middleware function in the application’s request-response cycle.
//They can execute any code, make changes to the request and response objects, end the request-response cycle, 
//or call the next middleware function in the stack.

// app.use("/", (req, res, next) => {
//     console.log("First middleware function");
//     // res.send("Response from the first middleware function");
//     next(); //Pass control to the next middleware function
// });

// app.use("multiUser", (req, res, next) => {
//     console.log("First middleware function");
//     // res.send("Response from the first middleware function");
//     next(); //Pass control to the next middleware function
// }, [(req, res, next) => {
//     console.log("Second middleware function");
//     // res.send("Response from the second middleware function");
//     next(); //Pass control to the next middleware function
// }, (req, res) => {
//     console.log("Third middleware function");
//     res.send("Response from the third middleware function");
// }]);


//correct way to handle errors
app.use("/getUserData", (req, res, next) => {
    try{
        throw new Error("An error occurred while fetching user data");
    }
    catch(err){
        res.status(500).send("An error occurred while fetching user data");
    }
});


//error handling middleware
app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("An error occured while processing your request");
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



