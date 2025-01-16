const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");

router.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

router.post(
  "/register",
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),
  body("email")
    .isEmail()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req, res) => {
    //const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("register", { errors: errors.array() });
    }
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const user = await userModel
      .create({
        username,
        email,
        password: hashPassword,
      })
      .then((user) => {
        // res.json(user);
        res.redirect("/user/login");
      })
      .catch((err) => {
        res.status(500).render("register", {
          errors: [{ msg: "Error creating user :" + err.message }],
        });
      });
  }
);

router.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

router.post(
  "/login",
  body("email")
    .isEmail()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req, res) => {
    //const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", { errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .render("login", { errors: [{ msg: "Email or password incorrect" }] });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .render("login", { errors: [{ msg: "Email or password incorrect" }] });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        username: user.username,
      },
      process.env.SECRET_KEY
    );

    //Add cookies expiration
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    // res.json({ message: "Logged in successfully" });
    return res.redirect("/");
  }
);

module.exports = router;
