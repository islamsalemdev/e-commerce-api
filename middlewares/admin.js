const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    if (user.isAdmin === false) {
      return res.status(403).json({
        message: "You are not authorized to do this action",
      });
    }

    req.user = user;
    req.token = token;
    next();
  });
  // try {
  //   const authHeader = req.header("Authorization");

  //   // // Check if the Authorization header exists and if it starts with 'Bearer'
  //   // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   //   return res.status(401).json({ message: "No auth token, access denied" });
  //   // }

  //   // Extract the token from the 'Bearer <token>' format
  //   const token = authHeader.split(" ")[1];

  //   // Verify the token
  //   const verified = jwt.verify(token, process.env.PASSWORD_KEY);
  //   if (!verified) {
  //     return res
  //       .status(401)
  //       .json({ message: "Token verification failed, authorization denied." });
  //   }

  //   // Find the user by the ID encoded in the token
  //   const user = await User.findById(verified.id);
  //   if (user.isAdmin === false) {
  //     return res.status(403).json({
  //       message: "You are not authorized to do this action",
  //     });
  //   }

  //   // Attach the user ID and token to the request object
  //   req.user = verified.id;
  //   req.token = token;

  //   // Move to the next middleware or route handler
  //   next();
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
};

module.exports = admin;
