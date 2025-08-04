const isEmail = require("validator/lib/isEmail");
const isStrongPassword = require("validator/lib/isStrongPassword");
const User = require("../models/userModel");

const validationSignup = async (clientData) => {
    const {firstName, age , gender, emailId, password} = clientData;

    if(!firstName) throw new Error ("first name is required");
    if(!gender) throw new Error ("gender is required");
    if(!age) throw new Error ("age is required");
    if(!emailId) throw new Error ("email is required");
    if(!password) throw new Error ("password is required");

    if(firstName.length < 2 || firstName.length > 12) throw new Error ("first name length is invalid");
    if(age < 18 || age > 120) throw new Error ("age number is not valid");
    if(gender !== "male" && gender !== "female" && gender !== "other") throw new Error ("invalid gender");
    if(isEmail(emailId)) {
        const user = await User.findOne({emailId : emailId})
        console.log(user);
        if(user) throw new Error ("user already exist");
    } else {
        throw new Error ("invalid email id");
    }
    if(!isStrongPassword(password)) throw new Error ("password is not strong");
}

module.exports = validationSignup;