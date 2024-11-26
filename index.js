const express = require("express");
const { PORT } = require("./consts/app");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Express Running on ${PORT}`);
});
