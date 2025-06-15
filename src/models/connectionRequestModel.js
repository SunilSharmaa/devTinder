const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        },
        status : {
            type : String,
            required : true,
            lowercase : true,
            enum : {
                values : ["interested", "ignored", "accepted", "rejected"],
                message : "{VALUE} is invalid status ",
            }
        }
    }
)

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;