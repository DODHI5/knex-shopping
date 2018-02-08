let express = require("express");
let router = express.Router();
let knex = require("../knex/knex.js");

router.get("/:user_id", (req, res) => {
  knex
    .raw("SELECT * FROM users WHERE users.id = ?", [req.params.user_id])
    .then(result => {
      if (result.rows.length) {
        return res.json(result.rows[0]);
      } else {
        res.json({ message: "not a user" });
      }
    });
});

router.post("/login", (req, res) => {
  knex
    .raw("SELECT * FROM users WHERE users.email = ?", [req.body.email])
    .then(result => {
      if (result.rows.length) {
        if (result.rows[0].password === req.body.password) {
          return res.json(result.rows[0]);
        } else {
          res.json({ message: "error" });
        }
      }
      res.json({ message: "error" });
    });
});

router.post("/register", (req, res) => {
  let { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  email = email.toLowerCase();
  return knex
    .raw("SELECT users.email FROM users WHERE users.email = ?", [
      req.body.email
    ])
    .then(result => {
      if (result.rows.length > 0) {
        throw new Error("User already exists");
      } else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(
        "INSERT INTO users (email, password, created_at, updated_at) VALUES (?, ?, ?, ?) RETURNING *",
        [req.body.email, req.body.password, "now()", "now()"]
      );
    })
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

router.put("/:user_id/forgot-password", (req, res) => {
  let password = req.body.password;
  let id = req.params.user_id;
  if (!password) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  return knex
    .raw("SELECT * FROM users WHERE users.id = ?", [id])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw new Error("Password already exists");
      }
    })
    .then(result => {
      knex
        .raw("UPDATE users SET password = ? WHERE users.id = ?", [password, id])
        .then(result => {
          return res.json({ message: "New password created!" });
        })
        .catch(err => {
          return res.status(400).json({ message: "err.message" });
        });
    });
});

router.delete("/:user_id", (req, res) => {
  let user = req.params.user_id;
  knex
    .raw(`SELECT * FROM users WHERE id = ?`, [user])
    .then(result => {
      if (result.rowCount === 0) {
        throw new Error("User ID not found");
      }
    })
    .then(result => {
      return knex
        .raw("DELETE FROM users WHERE users.id = ?", [user])
        .then(result => {
          res.json({ message: `User id: ${user} successfully deleted` });
        });
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
});

module.exports = router;

// router.get("/:user_id", (req, res) => {
//   let test = { message: "smoke test" };
//   res.json(test);
//   console.log("smoke test");
// });
