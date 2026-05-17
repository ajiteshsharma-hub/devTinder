const mongoose = require('mongoose');
const validator = require('validator'); // Importing the validator library for validating email addresses
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        } 
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
            };
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        //This validate function will run only when we create new user and not when we update user data
        //So, we need to use the runValidators in findByIdAndUpdate function in app.js to run this validate function when we update user data

        validate(value) {
            if(!["Male", "Female", "Other"].includes(value)){
                throw new Error("Invalid gender value");
            }
        }
    },

    photoURL: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
        }
    },

    about: {
        type: String,
        maxLength: 200,
        default: "This is the about section. You can write something about yourself here."
    },

    skills: {
        type: [String]
    },

    city: { 
        type: String
    },
    
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function() {
    const user = this;
    
    const token = await jwt.sign({_id : user._id}, "secretKey", {expiresIn: "7d"});

    return token;
};

userSchema.methods.validatePassword = async function(password) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;