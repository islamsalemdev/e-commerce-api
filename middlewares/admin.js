const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(401).json({ message: "No auth token, access denied" });

    const verified = jwt.verify(token, process.env.PASSWORD_KEY);
    if (!verified)
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied." });
    const user = await User.findById(verified.id);
    if (user.isAdmin == false) {
      return res.status(401).json({
        message: "You are not authorized to do this action",
      });
    }
    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = admin;
