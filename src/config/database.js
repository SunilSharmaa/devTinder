const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.DATABASE_URI;

const connectDb = async () => {
  await mongoose.connect(uri);
};

module.exports = connectDb;
