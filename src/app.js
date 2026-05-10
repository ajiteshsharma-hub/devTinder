const express = require('express');

const app = express(); //Create an instance of the express application

//Middleware function to handle incoming requests and send a response
app.get("/test", (req, res) => {
    res.send('Server is working!');
});

app.get("/user", (req, res) => {
    res.send({firstName: "Ajitesh", lastName: "Sharma"});
});

app.post("/user", (req, res) => {
    //Saving data to database
    res.send("Data has been saved to the database");
});

app.delete("/user", (req, res) => {
    //Deleting data from database
    res.send("Data has been deleted from the database");
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



