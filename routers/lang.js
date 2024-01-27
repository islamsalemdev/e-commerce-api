const express = require("express");
const langMiddleWare = require("../middlewares/lang");
const router = express.Router();
router.get("/api/v1/lang", (req, res) => {
  res.json({
    hello: res.__("Hello"),
    new: res.__("new"),
  });
});
module.exports = router;
