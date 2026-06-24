const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // kiểm tra email tồn tại
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới (FIX ROLE Ở ĐÂY)
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "student"   // ⭐ QUAN TRỌNG
    });

    res.status(201).json({
      message: "Register success",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login success",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ME
const getMe = async (req, res) => {
  res.status(200).json({
    message: "User authenticated",
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getMe
};