const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;

mongoose.set("strictQuery", false);

function connectToMongoDB() {
  mongoose
    .connect(MONGODB_CONNECTION_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
  });
}
module.exports = { connectToMongoDB };

