const express = require("express");
const router = express.Router();

// Routes for User

// INdex Route
router.get("/", (req, res) => {
  res.send("Get for Users");
});

// Show Route
router.get("/:id", (req, res) => {
  res.send("Get for userId");
});

// Post
router.post("/", (req, res) => {
  res.send("Post Route for Users");
});

// Post -> Create/Edit/Delete
router.delete("/:id", (req, res) => {
  res.send("Delete Route for UserId");
});


module.exports = router;