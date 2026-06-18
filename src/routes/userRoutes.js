const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {
  res.json({ message: "Admin route" });
});

router.get("/manager", (req, res) => {
  res.json({ message: "Manager route" });
});

router.get("/user", (req, res) => {
  res.json({ message: "User route" });
});

module.exports = router;
