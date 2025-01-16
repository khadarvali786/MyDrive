const mongoose = require("mongoose");

function connectToDatabase() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Error connecting to MongoDB");
    });
}

module.exports = connectToDatabase;
