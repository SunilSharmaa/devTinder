const express = require("express");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");
const authUser = require("../validation/authUser");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id.toString();
      const { status, userId } = req.params;

      const allowedStatus = ["interested", "ignored"];
      const isStatusValid = allowedStatus.includes(status);

      if (!isStatusValid) {
        throw new Error("invalid status");
      }

      const isUserExist =
        (await User.countDocuments({
          _id: userId,
        })) > 0;

      if (!isUserExist) {
        throw new Error("sending connection request to invalid user");
      }

      const isConnectionRequestDuplicate =
        (await ConnectionRequest.countDocuments({
          $or: [
            {
              toUserId: loggedInUserId,
              fromUserId: userId,
            },
            {
              toUserId: userId,
              fromUserId: loggedInUserId,
            },
          ],
        })) > 0;

      if (isConnectionRequestDuplicate) {
        throw new Error("cannot send connection request again");
      }

      const connectionRequest = new ConnectionRequest({
        toUserId: userId,
        fromUserId: loggedInUserId,
        status: status,
      });

      await connectionRequest.save();
      res.status(200).json({
        message: "connection request send",
      });
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:userId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id.toString();
      const { status, userId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      const isAllowedStatus = allowedStatus.includes(status);

      if (!isAllowedStatus) throw new Error("status is invalid");

      const isUserIdValid = (await User.countDocuments({
        _id : userId
      })) > 0;

      if(!isUserIdValid) throw new Error("invalid user");

      const connectionRequest =  await ConnectionRequest.findOne({
        toUserId : loggedInUserId,
        fromUserId : userId,
        status : "interested"
      })

      if(!connectionRequest) throw new Error("invalid connection request");

      connectionRequest.status = status;

      await connectionRequest.save();

      res.json({
        message : "request " + status,
        data : connectionRequest
      })


    } catch (err) {
      res.status(400).json({
          error : err.message
      })
    }
  }
);

module.exports = connectionRequestRouter;
