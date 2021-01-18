const express = require("express");
const app = express();
const Port = 4001;
const auth = require("./authentication");
require("dotenv").config();

//Workshop Link
//https://wildcodeschool.github.io/jwt-authentication-workshop/

//Models
const User = require("./models/User");

app.use(express.json());
app.use(express.urlencoded());

//Step 1 & 4 Workshop
app.get("/api/v1/users", auth.isAuthenticated, async (req, res, next) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

//Step 2 Workshop
app.post("/api/v1/users", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await auth.register({ email, password });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

//Step 3 Workshop

app.post("/api/v1/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await auth.authenticate({ email, password });
    res.status(200).json(token);
  } catch (error) {
    res.status(401).send(error);
  }
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
