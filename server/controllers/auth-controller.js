const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail, sendOTPEmail } = require("../utils/email");

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

    // Generate and send OTP
    const otp = userCreate.generateOTP();
    await userCreate.save();

    try {
      await sendOTPEmail(email, otp, username);
      res.render("verify-otp", {
        email: email,
        error: null,
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      await User.findByIdAndDelete(userCreate._id);
      return res.render("register", {
        error: "Failed to send verification email. Please try again.",
        formData: req.body,
      });
    }
  } catch (error) {
    console.error(error);
    res.render("register", {
      error: "Registration failed. Please try again.",
      formData: req.body,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Email not registered. Please check your email or register.",
        formData: { email },
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render("login", {
        error: "Incorrect password. Please try again.",
        formData: { email },
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP and send
      const otp = user.generateOTP();
      await user.save();
      await sendOTPEmail(email, otp, user.username);

      return res.render("verify-otp", {
        email: email,
        error: null,
      });
    }

    // Set session and redirect for verified users
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
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

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("verify-otp", {
        email,
        error: "User not found",
      });
    }

    if (!user.verifyOTP(otp)) {
      return res.render("verify-otp", {
        email,
        error: "Invalid or expired OTP. Please try again.",
      });
    }

    // OTP is valid - update user verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Set session and redirect
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    res.redirect("/home");
  } catch (error) {
    console.error("OTP verification error:", error);
    res.render("verify-otp", {
      email: req.body.email,
      error: "Verification failed. Please try again.",
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("verify-otp", {
        email,
        error: "User not found",
      });
    }

    // Generate new OTP and send
    const otp = user.generateOTP();
    await user.save();
    await sendOTPEmail(email, otp, user.username);

    res.render("verify-otp", {
      email,
      error: null,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.render("verify-otp", {
      email: req.query.email,
      error: "Failed to resend OTP. Please try again.",
    });
  }
};

module.exports = {
  home,
  registerForm,
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
};
