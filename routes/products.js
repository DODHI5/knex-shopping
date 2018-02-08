let express = require("express");
let router = express.Router();
let knex = require("../knex/knex.js");

router.get("/", (req, res) => {
  knex
    .raw("SELECT * FROM products ")
    .then(result => {
      if (result.rows.length) {
        return res.json(result.rows[0]);
      } else {
        res.json({ message: "not a product" });
      }
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

router.get("/:product_id", (req, res) => {
  knex
    .raw("SELECT * FROM products WHERE products.id = ?", [
      req.params.product_id
    ])
    .then(result => {
      if (result.rows.length) {
        return res.json(result.rows[0]);
      } else {
        res.json({ message: "not a user" });
      }
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

router.post("/new", (req, res) => {
  let { title, description, inventory, price } = req.body;
  title = title.toLowerCase();
  description = description.toLowerCase();
  if (!(title || description || inventory || price)) {
    throw new Error("Missing title, description, inventory or price");
  }
  return knex
    .raw(
      "INSERT INTO products (title, description, inventory, price) VALUES (?, ?, ?, ?) RETURNING *",
      [title, description, inventory, price]
    )
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

router.put("/:product_id", (req, res) => {
  let { title, description, inventory, price } = req.body;
  let product = req.params.product_id;
  if (!product) {
    return res.status(400).json({ message: "Incorrect product" });
  }
  return knex
    .raw("SELECT * FROM products WHERE products.id = ?", [product])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw new Error("product already exists");
      }
    })
    .then(result => {
      knex
        .raw(
          "UPDATE products SET (title, description, inventory, price) = (?, ?, ?, ?) WHERE products.id = ?",
          [title, description, inventory, price, product]
        )
        .then(result => {
          return res.json({ message: "New product created!" });
        })
        .catch(err => {
          return res.status(400).json({ message: "err.message" });
        });
    });
});

router.delete("/:product_id", (req, res) => {
  let product = req.params.product_id;
  knex
    .raw(`SELECT * FROM products WHERE id = ?`, [product])
    .then(result => {
      console.log(result.rowCount);
      if (result.rowCount === 0) {
        throw new Error("product ID not found");
      }
    })
    .then(result => {
      console.log(result);
      return knex
        .raw("DELETE FROM products WHERE products.id = ?", [product])
        .then(result => {
          res.json({ message: `product id: ${product} successfully deleted` });
        });
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});
module.exports = router;
