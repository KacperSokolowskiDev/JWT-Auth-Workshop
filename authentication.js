// authentication.js
const argon2 = require("argon2");
const randomBytes = require("randombytes");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJWT = require("express-jwt");

const secret = process.env.JWT_SECRET;

const register = async ({ email, password }) => {
  const salt = randomBytes(32);
  const hashedPassword = await argon2.hash(password, { salt });
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    email: user.email,
  };
};

const authenticate = async ({ email, password }) => {
  console.log(email, password);
  const user = await User.findOne({ email });
  const isPasswordCorrect = await argon2.verify(user.password, password);
  const payload = {
    id: user.id,
  };

  if (!user) {
    throw new Error("User not found");
  }
  if (!isPasswordCorrect) {
    throw new Error("Incorrect password");
  }

  return {
    token: jwt.sign(payload, secret, { expiresIn: "6h" }),
  };
};

const isAuthenticated = expressJWT({
  secret,
  algorithms: ["sha1", "RS256", "HS256"],
});

module.exports = {
  register,
  authenticate,
  isAuthenticated,
};
