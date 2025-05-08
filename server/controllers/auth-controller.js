const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../utils/email");

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
      return res.render("register", {
        error: "Email already registered",
        formData: req.body,
      });
    }

    // Create user - password hashing is handled by the model's pre-save middleware
    const userCreate = await User.create({
      username,
      email,
      phone,
      password,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, username);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Create session but show warning about email
      req.session.user = {
        id: userCreate._id,
        username: userCreate.username,
        email: userCreate.email,
        phone: userCreate.phone,
        createdAt: userCreate.createdAt,
      };
      return res.render("home", {
        user: req.session.user,
        error:
          "Account created successfully, but we couldn't send the welcome email. Please check your email settings.",
      });
    }

    // Set session and redirect on complete success
    req.session.user = {
      id: userCreate._id,
      username: userCreate.username,
      email: userCreate.email,
      phone: userCreate.phone,
      createdAt: userCreate.createdAt,
    };

    res.redirect("/home");
  } catch (error) {
    console.error("Registration error:", error);
    res.render("register", {
      error: "Registration failed. Please try again.",
      formData: req.body,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.render("login", {
        error: "Email not registered. Please check your email or register.",
        formData: { email },
      });
    }

    // Then verify password
    try {
      const isPasswordValid = await bcrypt.compare(password, userExist.password);
      if (!isPasswordValid) {
        return res.render("login", {
          error: "Incorrect password. Please try again.",
          formData: { email },
        });
      }
    } catch (bcryptError) {
      console.error("Password comparison error:", bcryptError);
      return res.render("login", {
        error: "Authentication failed. Please try again.",
        formData: { email },
      });
    }

    // Set session and redirect on success
    req.session.user = {
      id: userExist._id,
      username: userExist.username,
      email: userExist.email,
      phone: userExist.phone,
      createdAt: userExist.createdAt,
    };

    res.redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      error: "Login failed. Please try again.",
      formData: { email: req.body.email },
    });
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
