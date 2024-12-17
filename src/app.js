const express = require("express");

const app = express();

//routes

app.get("/user", (req, res)=> {
    res.send("get data successfully");
})

app.post("/user", (req, res)=> {
    res.send("post data successfully");
})

app.patch("/user", (req, res)=> {
    res.send("patch data successfully");
})

app.delete("/user", (req, res)=> {
    res.send("delete data successfully");
})

//listen
app.listen(7000, ()=> {
    console.log("server running");
});