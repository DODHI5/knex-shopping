const express = require("express");
const router = express.Router();
const knex = require("../knex/knex.js");

router.get("/:user_id", (req, res) => {
  let user = req.params.user_id;
  return knex
    .raw("SELECT * FROM users where users.id = ?", [user])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw Error("no user found");
      }
    })
    .then(result => {
      return knex.raw(
        "SELECT products.id, products.title, products.description, products.price FROM products INNER JOIN cart ON cart.products_id = products.id INNER JOIN users ON users.id = cart.user_id WHERE users.id = ?",
        [user]
      );
    })
    .then(result => {
      if (result.rows.length) {
        return res.json(result.rows);
      } else {
        return res.json({ message: "no items in cart" });
      }
    })
    .catch(err => {
      return res.json({ message: err.message });
    });
});

router.post("/:user_id/:product_id", (req, res) => {
  let user = req.params.user_id;
  let product = req.params.product_id;
  if (!(user || product)) {
    res.status(400).json({ message: "Sorry" });
  }
  knex
    .raw("SELECT * FROM users WHERE users.id = ?", [user])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw new Error("Sorry");
      }
    })
    .then(result => {
      return knex
        .raw("SELECT * FROM products WHERE products.id = ?", [product])
        .then(result => {
          if (result.rows.length) {
            return result;
          } else {
            res.status(404).json({ message: "sorry" });
          }
        });
    })
    .then(result => {
      return knex
        .raw("INSERT INTO cart (user_id, products_id ) VALUES (?,?)", [
          user,
          product
        ])
        .then(result => {
          return res.json({ success: true });
        })
        .catch(err => {
          return res.status(400).json({ message: err.message });
        });
    });
});
router.delete("/:user_id/:product_id", (req, res) => {
  let user = req.params.user_id;
  let product = req.params.product_id;
  return knex
    .raw("SELECT * FROM users WHERE users.id = ?", [user])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw Error("no user");
      }
    })
    .then(result => {
      return knex.raw("SELECT * FROM products WHERE products.id = ?", [
        product
      ]);
    })
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw Error("product not found");
      }
    })
    .then(result => {
      return knex.raw(
        "DELETE FROM cart WHERE cart.user_id = ? AND cart.products_id = ?",
        [user, product]
      );
    })
    .then(result => {
      if (result.rowCount) {
        return res.json({ success: "true" });
      } else {
        return res.json({
          message: "could not find"
        });
      }
    })
    .catch(err => {
      return res.json({ message: err.message });
    });
});

module.exports = router;
