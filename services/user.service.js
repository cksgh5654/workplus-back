const User = require("../schemas/user.schema");
const { processImageUrl, removeUndefinedFields } = require("../utils/utils");

const createUser = ({
  email,
  username,
  userImage,
  emailValidationStatus,
  signupType,
}) => {
  const filterdObject = removeUndefinedFields({
    email,
    username,
    userImage,
    emailValidationStatus,
    signupType,
  });
  try {
    const document = User.create(filterdObject);
    return document;
  } catch (error) {
    throw new Error("[DB createUser] 에러", { cause: error });
  }
};

const getUsers = async (limit, skip) => {
  try {
    const documents = User.find({}, "_id username email phone birth address") //
      .sort({ _id: 1 })
      .limit(limit)
      .skip(limit * skip);
    return documents;
  } catch (error) {
    throw new Error("[findUsers 에러]", { cause: error });
  }
};

const getUsersCount = async () => {
  return await User.countDocuments();
};

const findUserById = async (id) => {
  try {
    const document = await User.findById(id).lean();
    if (document === null) return null;
    return { ...document, userImage: processImageUrl(document.userImage) };
  } catch (error) {
    throw new Error("[DB findUserById] 에러", { cause: error });
  }
};

const findUserByEmail = async (email) => {
  try {
    const document = await User.findOne({ email }).lean();
    if (document === null) return null;
    return { ...document, userImage: processImageUrl(document.userImage) };
  } catch (error) {
    throw new Error("[DB findUserByEmail] 에러", { cause: error });
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
    throw new Error("[DB findUsersByUsername] 에러", { cause: error });
  }
};

const getUsersAttendance = async (limit, skip) => {
  try {
    const documents = await User.find({}, "_id username userImage attendance") //
      .sort({ _id: 1 })
      .limit(limit)
      .skip(limit * skip);
    return documents;
  } catch (error) {
    throw new Error("[DB getUsersAttendance] 에러", { cause: error });
  }
};

const updateUserById = async (
  id,
  {
    username,
    password,
    userImage,
    phone,
    birth,
    address,
    token,
    emailValidationStatus,
    signupType,
    attendance,
    isAdmin,
  }
) => {
  const filterdObject = removeUndefinedFields({
    username,
    password,
    userImage,
    phone,
    birth,
    address,
    token,
    emailValidationStatus,
    signupType,
    attendance,
    isAdmin,
  });
  try {
    const updated = await User.findByIdAndUpdate(id, filterdObject);
    if (!updated) {
      return null;
    }
    return updated;
  } catch (error) {
    throw new Error("[DB updateUserById] 에러", { cause: error });
  }
};

const updateUserByEmail = async (
  email,
  {
    username,
    password,
    userImage,
    phone,
    birth,
    address,
    token,
    emailValidationStatus,
    signupType,
    attendance,
    isAdmin,
  }
) => {
  const filterdObject = removeUndefinedFields({
    username,
    password,
    userImage,
    phone,
    birth,
    address,
    token,
    emailValidationStatus,
    signupType,
    attendance,
    isAdmin,
  });
  try {
    const updated = await User.updateOne({ email }, filterdObject);
    if (!updated) {
      return null;
    }
    return updated;
  } catch (error) {
    throw new Error("[DB updateUserByEmail] 에러", { cause: error });
  }
};

const deleteUserById = async (id) => {
  try {
    const deleted = await User.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    throw new Error("DB에러", { cause: error });
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  updateUserById,
  updateUserByEmail,
  findUsersByUsername,
  getUsersAttendance,
  deleteUserById,
  getUsers,
  getUsersCount,
};
