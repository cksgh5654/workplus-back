const { BASE_URL } = require("../consts/app");

const processImageUrl = (url) => {
  if (!url.length) {
    return "";
  }
  const isGoolgeProvide = url.startsWith("https://lh3.googleusercontent.com");
  return isGoolgeProvide ? url : `${BASE_URL}/${url}`;
};

module.exports = {
  processImageUrl,
};
