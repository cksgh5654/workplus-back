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

const findVacationById = async (id) => {
  try {
    const document = await Vacation.findById(id);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateVacationById = async (data) => {
  const { id, ...rest } = data;
  try {
    const document = await Vacation.findByIdAndUpdate(id, rest);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteVacationById = async (id) => {
  try {
    const result = await Vacation.findByIdAndDelete(id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findVacationsByUserId = async (requesterId) => {
  try {
    const vacations = await Vacation.find({ requesterId });
    return vacations;
  } catch (error) {
    throw new Error(error);
  }
};

const findVacationsByDate = async (startDate, endDate) => {
  try {
    const documents = await Vacation.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const findVacationsByMonth = async (startDate, endDate) => {
  try {
    const documents = await Vacation.find(
      {
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      },
      "-__v -updatedAt"
    );
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
  findVacationsByDate,
  findVacationsByMonth,
};
