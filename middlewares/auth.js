const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check if the Authorization header exists and starts with 'Bearer'
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ msg: "You are not authorized" });
    // }

    // Extract the token from the 'Bearer <token>' format
    const token = authHeader.split(" ")[1];

    // Verify the token
    const verified = jwt.verify(token, process.env.PASSWORD_KEY);

    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    }

    // Find the user by the ID encoded in the token
    const user = await User.findById(verified.id);

    // If the user is an admin, block them from accessing
    if (user.isAdmin === true) {
      return res
        .status(403)
        .json({ msg: "Admins are not authorized to perform this action." });
    }

    // Attach the user ID and token to the request object
    req.user = verified.id;
    req.token = token;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = userAuth;
