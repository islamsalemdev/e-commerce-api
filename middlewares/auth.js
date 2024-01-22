const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.header("x-token");
    if (!token) return res.status(401).json({ msg: "Your are not authorized" });

    const verified = jwt.verify(token, process.env.PASSWORD_KEY);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = userAuth;
