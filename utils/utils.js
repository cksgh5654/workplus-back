const bcrypt = require("bcrypt");
const { BASE_URL, SALT_ROUNDS } = require("../consts/app");

const processImageUrl = (url) => {
  if (!url.length) {
    return "";
  }
  const isGoolgeProvide = url.startsWith("https://lh3.googleusercontent.com");
  return isGoolgeProvide ? url : `${BASE_URL}/${url}`;
};

/**
 * 인수로받은 Date의 첫째 날과 마지막 날을 ISODate로반환 하는 함수
 * @param {Date} date  yyyy-mm-dd
 * @return {Object} 첫째 날 마지막 날을 가지는 객체
 */
const processDateToISODate = (date) => {
  return {
    startDate: new Date(`${date}T00:00:00.000Z`),
    endDate: new Date(`${date}T23:59:59.999Z`),
  };
};

/**
 * 인수로받은 Date의 첫째 날과 마지막 날을 반환 하는 함수
 * @param {Date} date  yyyy-mm
 * @return {Object} 첫째 날 마지막 날을 가지는 객체
 */
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

const removeUndefinedFields = (object) => {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] !== undefined) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
};

module.exports = {
  processImageUrl,
  processDateToISODate,
  createHashedPassword,
  comparePassword,
  getMonthStartEndDates,
  removeUndefinedFields,
};
