const express = require("express");
const router = express.Router();
router.get("/api/v1/lang", (req, res) => {
  res.json({
    hello: res.__({ phrase: "Hello", locale }),
    new: res.__("new"),
  });
});
module.exports = router;
