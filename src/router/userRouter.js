const express = require("express");
const userRouter = express.Router();
const authUser = require("../validation/authUser");
const ConnectionRequest = require("../models/connectionRequestModel");

userRouter.get("/user/request/received", authUser, async(req, res) => {
    
    try{

        const loggedInUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser,
            status : "interested"
        })
        .populate("fromUserId", "firstName lastName")
        .populate("toUserId", "firstName lastName")

        if(connectionRequest.length > 0) {
            res.json({
                data : connectionRequest
            })
        } else {
            res.json({
                data : "no connection request found"
            })
        }

    } catch (err) {
        res.status(400).json( {
            error : err.message
        })
    }

})

module.exports = userRouter;