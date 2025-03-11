const withAuth = require("../middlewares/auth");
const adminController = require("./admin.controller");
const authController = require("./auth.controller");
const meetingController = require("./meeting.controller");
const userController = require("./user.controller");
const vacationController = require("./vacation.controller");
const apiController = require("express").Router();

apiController.use("/user", withAuth, userController);
apiController.use("/auth", authController);
apiController.use("/vacation", withAuth, vacationController);
apiController.use("/meeting", withAuth, meetingController);
apiController.use("/admin", withAuth, adminController);

module.exports = apiController;
