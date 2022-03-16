const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (token) {
    jwt.verify(
      token,
      "zayarwin",
      (err, decoded) => {
        if (err) {
          res.redirect("/login");
        }
        if (decoded) {
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

module.exports = verifyToken;
