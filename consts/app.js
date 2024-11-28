require("dotenv").config();

const PORT = process.env.PORT || 8080;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
module.exports = {
  PORT,
  MONGO_DB_URL,
  JWT_SECRET_KEY,
};
