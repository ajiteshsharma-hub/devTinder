const validator = require('validator');
const bcrypt = require('bcrypt');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, userName, password} = req.body;

    if(!firstName || !lastName){
        throw new Error ("First name and last name are required");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid email address");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
};

const validateUserProfile = (req) => {
    const allowedFields = ["lastName", "about", "skills", "gender", "photoURL"];
    const isUpdateAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
    
    return isUpdateAllowed;
};

const validateUserPassword = (req, existingPassword) => {
    const {oldPassword} = req.body;
    const isPasswordValid = bcrypt.compare(oldPassword, existingPassword);
    return isPasswordValid;
};

const isStrongPassword = (req) => {
    const {newPassword} = req.body;
    const strongPassword = validator.isStrongPassword(newPassword);
    return strongPassword;
};

module.exports = {
    validateSignUpData,
    validateUserProfile,
    validateUserPassword,
    isStrongPassword
}