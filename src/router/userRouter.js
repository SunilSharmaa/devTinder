const express = require("express");
const userRouter = express.Router();
const authUser = require("../validation/authUser");
const ConnectionRequest = require("../models/connectionRequestModel");

userRouter.get("/user/request/received", authUser, async(req, res) => {
    
    try{

        const loggedInUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
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

userRouter.get("/user/connection", authUser, async(req, res)=> {

    try{
        const loggedInUserId = req.user._id.toString();

        const userConnection = await ConnectionRequest.find({

            $or : [
                {
                    fromUserId : loggedInUserId,
                    status : "accepted"
                },
                {
                    toUserId : loggedInUserId,
                    status : "accepted"
                }
            ]
        }
         ).populate("fromUserId", "firstName lastName")
         .populate("toUserId", "firstName lastName")

         const userData = userConnection.map((key) => {

            if(loggedInUserId === key.fromUserId._id.toString()) {
                return key.toUserId
            }

            return key.fromUserId;
         });

         console.log(userConnection);

         if(userConnection.length > 0) {
            res.json({
                data : userData
            })
         } else {
            res.json({
                data : "no connection found"
            })
         }

    } catch (err) {
        res.status(400).json({
            error : err.message
        })
    }
})

module.exports = userRouter;