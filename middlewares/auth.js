const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "Your are not authorized" });

    const verified = jwt.verify(token, process.env.PASSWORD_KEY);
    const user = await User.findById(verified.id);
    if (!verified || user.isAdmin == true)
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

// const jwt = require("jsonwebtoken");

// // Middleware for Bearer Token authentication
// const userAuth = (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ msg: 'Unauthorized - Bearer token missing' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ msg: 'Unauthorized - Invalid token' });
//   }
// };

// Protected route
// app.get('/api/protected', authenticate, (req, res) => {
//   res.json({ msg: 'You have access to this protected route', user: req.user });
// });

module.exports = userAuth;
