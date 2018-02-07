const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile.js")[environment];
module.exports = require("knex")(config);
const users = require("./routes/users");
const products = require("./routes/products");
const carts = require("./routes/carts");

const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const knex = require("./knex/knex.js");

app.get("/tasks", (req, res) => {});

app.use("/routes/users", users);
app.use("/routes/products", products);
app.use("/routes/carts", carts);

app.listen(PORT, err => {
  if (err) {
    throw err;
  }
  console.log(`Server's up on port: ${PORT}`);
});
