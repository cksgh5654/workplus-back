const express = require("express");
const { PORT } = require("./consts/app");
const apiController = require("./controllers");
const User = require("./schemas/user.schema");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiController);

app.listen(PORT, () => {
  console.log(`Express Running on ${PORT}`);
});
