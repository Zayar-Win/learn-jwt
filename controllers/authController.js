const User = require("../models/User");
const jwt = require("jsonwebtoken");

const errorHandler = (error) => {
  console.log(error.message, error.code);
  let errors = { email: "", password: "" };
  if (error.code === 11000) {
    errors["email"] =
      "This eamil is already register!!!";
    return errors;
  }
  if (error.message === "incorrect email") {
    errors.email = "Incorrect email";
  }
  if (error.message === "incorrect password") {
    errors.password = "Wrong password";
  }
  if (
    error.message.includes(
      "user validation failed"
    )
  ) {
    Object.values(error.errors).forEach(
      ({ properties }) => {
        errors[properties.path] =
          properties.message;
      }
    );
  }
  return errors;
};

module.exports.signup_get = (req, res) => {
  res.render("singup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "zayarwin", {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({
      email,
      password,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(
      email,
      password
    );
    const token = createToken(user._id);
    res.cookie("jwt", token);
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = errorHandler(error);
    res.status(400).json({ errors });
  }
};
