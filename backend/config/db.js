const mongoose = require("mongoose");
// Imports mongoose library

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    // Connects to MongoDB

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
