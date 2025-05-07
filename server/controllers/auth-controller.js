const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// Render pages
const home = async (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("login", { error: null });
  }
};

const registerForm = async (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("register", { error: null });
  }
};

// API handlers
const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.render("register", { error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreate = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    // Set session and redirect
    req.session.user = {
      id: userCreate._id,
      username: userCreate.username,
      email: userCreate.email,
      phone: userCreate.phone,
      createdAt: userCreate.createdAt,
    };

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.render("register", { error: "Registration failed. Please try again." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.render("login", { error: "Invalid credentials" });
    }

    // Set session and redirect
    req.session.user = {
      id: userExist._id,
      username: userExist.username,
      email: userExist.email,
      phone: userExist.phone,
      createdAt: userExist.createdAt,
    };

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.render("login", { error: "Login failed. Please try again." });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
};

module.exports = { home, registerForm, register, login, logout };
