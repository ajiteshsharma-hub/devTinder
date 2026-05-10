const express = require('express');

const app = express(); //Create an instance of the express application

app.get("/", (req, res) => {
    res.send('Hello from the server!');
}); //Middleware function to handle incoming requests and send a response

app.get("/test", (req, res) => {
    res.send('Server is working!');
});

app.get("/hello", (req, res) => {
    res.send('hello world');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



