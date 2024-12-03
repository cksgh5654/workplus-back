require("dotenv").config();

const PORT = process.env.PORT ?? 8080;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const FRONT_END_POINT = process.env.FRONT_END_POINT;
const BASE_URL = process.env.BASE_URL;

module.exports = {
  PORT,
  MONGO_DB_URL,
  JWT_SECRET_KEY,
  FRONT_END_POINT,
  BASE_URL,
};
