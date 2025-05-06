const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/userModel");

const app = express();

app.post("/signup", async(req, res) => {
    const userObj = new User({
        firstName: "sunil3",
        lastName : "sharma3",
        email : "sunil3@gmail.com",
        password : "sunil@1234",
        gender : "male",
        education : "mca"

    })

    try{
       await userObj.save();
       res.send("data save successfully")
    }
    catch{
        res.code(400).send("bad request");
    }
})

connectDb()
.then(()=> {
    console.log("connection established");
    app.listen(7000, () => {
        console.log("server running");
    });
})
.catch((err) => console.log(err))



//listen

