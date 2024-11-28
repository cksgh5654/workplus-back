const User = require("../schemas/user.schema");

const createUser = (userData) => {
  try {
    const document = User.create(userData);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserById = async (id) => {
  try {
    const document = await User.findOne(id);
    return !!document === null ? false : true;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByEmail = async (email) => {
  try {
    const document = await User.findOne(email);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (data) => {
  const { email, ...rest } = data;
  try {
    const updated = await User.updateOne({ _id: id }, rest);
    if (!updated) {
      return null;
    }
    return updated;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
};
