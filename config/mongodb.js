const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    //console.log(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
