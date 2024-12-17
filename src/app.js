const express = require("express");

const app = express();


app.use("/test/2", (req, res)=> {
    res.send("output from test----2 route")
})

app.use("/test", (req, res)=> {
    res.send("output from test route")
})

app.use("/hello/2", (req, res)=>{
    res.send("output from hello-----2 route");
})

app.use("/hello", (req, res)=>{
    res.send("output from hello route");
})

app.use("/", (req, res)=> {
    res.send("dashboard")
})

app.listen(7000, ()=> {
    console.log("server running");
});