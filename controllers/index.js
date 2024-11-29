const authController = require("./auth.controller");
const meetingController = require("./meeting.controller");
const userController = require("./user.contorller");
const vacationController = require("./vacation.controller");
const apiController = require("express").Router();

apiController.use("/user", userController);
apiController.use("/auth", authController);
apiController.use("/vacation", vacationController);
apiController.use("/meeting", meetingController);

module.exports = apiController;
