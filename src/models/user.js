const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true    
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    city: { 
        type: String
     },
    
});

const User = mongoose.model("User", userSchema);

module.exports = User;