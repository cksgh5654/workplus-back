const User = require("../schemas/user.schema");

const createUser = (userData) => {
  try {
    const document = User.create(userData);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserById = async ({ id }) => {
  try {
    const document = await User.findOne({ _id: id });
    return document;
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

const findUsersByUsername = async (username) => {
  try {
    const documents = await User.find(
      { username: { $regex: username } },
      "username _id"
    );
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserById = async (data) => {
  const { id, ...rest } = data;
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

const updateUserByEmail = async (data) => {
  const { email, ...rest } = data;
  try {
    const updated = await User.updateOne({ email }, rest);
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
  updateUserById,
  updateUserByEmail,
  findUsersByUsername,
};
