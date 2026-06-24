const express = require("express");
const router = express.Router();

// import controller
const { 
  register, 
  login, 
  getMe 
} = require("../controllers/authController");

// import middleware kiểm tra token
const verifyToken = require("../middlewares/authMiddleware");

// test route (giữ lại nếu bạn muốn test)
router.get("/test", (req, res) => {
  res.send("Auth route OK");
});

// public routes
router.post("/register", register);
router.post("/login", login);

// protected route (phải có token mới vào được)
router.get("/me", verifyToken, getMe);

module.exports = router;