const userController = require("./user.contorller");
const apiController = require("express").Router();

apiController.use("/user", userController);

module.exports = apiController;
