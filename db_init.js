const mongoose = require("mongoose");

const { MONGO_DB_URL } = require("./consts/app");

mongoose
  .connect(MONGO_DB_URL, { dbName: "workplus" })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("fail to connect mongoDB", error));

module.exports = mongoose;
