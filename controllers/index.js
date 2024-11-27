const authController = require("./auth.controller");
const userController = require("./user.contorller");
const apiController = require("express").Router();

apiController.use("/user", userController);
apiController.use("/auth", authController);

module.exports = apiController;
