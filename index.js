require("dotenv").config();
const express = require("express");
const { PORT } = require("./consts/app");
const apiController = require("./controllers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api", apiController);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Express Running on ${PORT}`);
});
