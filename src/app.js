const express = require('express');

const app = express(); //Create an instance of the express application

//Middleware function to handle incoming requests and send a response
app.get("/test", (req, res) => {
    res.send('Server is working!');
});

app.get("/user", (req, res) => {
    res.send({firstName: "Ajitesh", lastName: "Sharma"});
});

// app.get("/user/:userId/:userName", (req, res) => {
        // : means that userId and userName are route parameters that can be accessed using req.params,
        //  it is a dynamic route that can handle requests with different userId and userName values
//     console.log(req.query); //Accessing query parameters from the request
//     console.log(req.params); //Accessing route parameters from the request
//     res.send({firstName: "Ajitesh", lastName: "Sharma"});

// });

app.post("/user", (req, res) => {
    //Saving data to database
    res.send("Data has been saved to the database");
});

app.delete("/user", (req, res) => {
    //Deleting data from database
    res.send("Data has been deleted from the database");
});

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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



