const { BASE_URL } = require("../consts/app");

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

module.exports = {
  processImageUrl,
  processDateToISODate,
};
