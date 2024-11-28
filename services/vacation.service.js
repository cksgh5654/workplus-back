const Vacation = require("../schemas/vacation.schema");

const createVacation = async (vacation) => {
  try {
    const document = await Vacation.create(vacation);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createVacation,
};
