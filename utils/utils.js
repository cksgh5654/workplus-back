const bcrypt = require("bcrypt");
const { BASE_URL, SALT_ROUNDS } = require("../consts/app");

const processImageUrl = (url) => {
  if (!url.length) {
    return "";
  }
  const isGoolgeProvide = url.startsWith("https://lh3.googleusercontent.com");
  return isGoolgeProvide ? url : `${BASE_URL}/${url}`;
};

const processDateToISODate = (date) => {
  return {
    startDate: new Date(`${date}T00:00:00.000Z`),
    endDate: new Date(`${date}T23:59:59.999Z`),
  };
};

const getMonthStartEndDates = (date) => {
  const [year, month] = date.split("-");
  const lastDate = new Date(year, month, 0).getDate();
  return {
    startDate: new Date(`${date}-01T00:00:00.000Z`),
    endDate: new Date(`${date}-${lastDate}T23:59:59.999Z`),
  };
};

const createHashedPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  processImageUrl,
  processDateToISODate,
  createHashedPassword,
  comparePassword,
  getMonthStartEndDates,
};
