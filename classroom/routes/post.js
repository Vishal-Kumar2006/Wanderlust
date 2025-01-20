const express = require("express");
const router = express.Router();

// Route for post
// INdex Route
router.get("/", (req, res) => {
  res.send("Get for Posts");
});

// Show Route
router.get("/:id", (req, res) => {
  res.send("Get for PostId");
});

// Post
router.post("/", (req, res) => {
  res.send("Post Route for Post");
});

// Post -> Create/Edit/Delete
router.delete("/:id", (req, res) => {
  res.send("Delete Route for Post Id");
});

module.exports = router;