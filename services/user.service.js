const User = require("../schemas/user.schema");

const createUser = (userData) => {
  try {
    const document = User.create(userData);
    return document;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findUserById = async (id) => {
  try {
    const result = await User.findOne(id);
    return result === null ? false : true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  createUser,
  findUserById,
};
