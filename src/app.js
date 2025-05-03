const express = require("express");

const app = express();

//routes
app.use("/admin", (req, res, next) => {
    const token = "ap1";
    const isAdminAuthorize = token === "ap1";
    
    if (isAdminAuthorize) {
        console.log("authorization");
        next();
    }

    else {
        res.status(401).send("unauthorize req");
    }
})

app.get("/admin/getAllData", (req, res) => {
    console.log("get data");
    res.send("got all the data");
})

app.delete("/admin/deleteAllData", (req, res)=> {
    console.log("delete data");
    res.send("delete all the data")
})

//listen
app.listen(7000, () => {});
