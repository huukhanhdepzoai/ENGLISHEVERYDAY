const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/models");

const authRoutes = require("./src/routes/authRoutes");
const vocabRoutes = require("./src/routes/vocabRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const classRoutes = require("./src/routes/classRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const quizRoutes = require("./src/routes/quizRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ROUTE
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/vocabularies", vocabRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);

// TEST
app.get("/hello", (req, res) => {
  res.send("HELLO WORD");
});

app.get("/", (req, res) => {
  res.send("API Running...");
});

// DB CONNECT
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return db.sequelize.sync(); // ✔ FIX HERE
  })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Database error:", err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});