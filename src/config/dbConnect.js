const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Connected to MongoDB : ${connect.connection.host}, ${connect.connection.name}`,
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = dbConnect;
