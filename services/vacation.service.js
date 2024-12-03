const Vacation = require("../schemas/vacation.schema");

const createVacation = async ({
  username,
  startDate,
  endDate,
  vacationType,
  reason,
  requesterId,
}) => {
  try {
    const document = await Vacation.create({
      username,
      startDate,
      endDate,
      vacationType,
      reason,
      requesterId,
    });
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const findVacationById = async ({ id }) => {
  try {
    const document = await Vacation.findOne({ _id: id });
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateVacationById = async (data) => {
  const { id, ...rest } = data;
  try {
    const document = await Vacation.updateOne({ _id: id }, rest);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteVacationById = async ({ id }) => {
  try {
    const result = await Vacation.deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findVacationsByUserId = async ({ id }) => {
  try {
    const vacations = await Vacation.find({ requesterId: id });
    return vacations;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllVacations = async () => {
  try {
    const documents = await Vacation.find();
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createVacation,
  findVacationById,
  updateVacationById,
  deleteVacationById,
  findVacationsByUserId,
  getAllVacations,
};
