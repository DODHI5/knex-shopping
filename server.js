let users = require("./routes/users");
let products = require("./routes/products");
let cart = require("./routes/cart");

const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const knex = require("./knex/knex.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", users);
app.use("/products", products);
app.use("/cart", cart);

app.listen(PORT, err => {
  if (err) {
    throw err;
  }
  console.log(`Server's up on port: ${PORT}`);
});
