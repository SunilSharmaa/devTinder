const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
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