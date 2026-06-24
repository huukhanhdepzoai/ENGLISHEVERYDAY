const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const db = {};

// Sequelize instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// =====================
// IMPORT MODELS
// =====================

db.User = require("./User")(sequelize, DataTypes);
db.Vocabulary = require("./Vocabulary")(sequelize, DataTypes);
db.Topic = require("./Topic")(sequelize, DataTypes);
db.Progress = require("./Progress")(sequelize, DataTypes);

db.Class = require("./Class")(sequelize, DataTypes);
db.Lesson = require("./Lesson")(sequelize, DataTypes);
db.StudentClass = require("./StudentClass")(sequelize, DataTypes);
db.LessonVocabulary = require("./LessonVocabulary")(sequelize, DataTypes);

// =====================
// RELATIONS
// =====================

//  Teacher → Class
db.User.hasMany(db.Class, {
  foreignKey: "teacherId",
  as: "teachingClasses",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.Class.belongsTo(db.User, {
  foreignKey: "teacherId",
  as: "teacher"
});

// 👨‍🎓 Student ↔ Class
db.User.belongsToMany(db.Class, {
  through: db.StudentClass,
  foreignKey: "studentId",
  otherKey: "classId",
  as: "enrolledClasses"
});

db.Class.belongsToMany(db.User, {
  through: db.StudentClass,
  foreignKey: "classId",
  otherKey: "studentId",
  as: "students"
});

// 📚 Class → Lesson
db.Class.hasMany(db.Lesson, {
  foreignKey: "classId",
  as: "lessons",
  onDelete: "CASCADE"
});

db.Lesson.belongsTo(db.Class, {
  foreignKey: "classId",
  as: "class"
});

// 📖 Lesson ↔ Vocabulary
db.Lesson.belongsToMany(db.Vocabulary, {
  through: db.LessonVocabulary,
  foreignKey: "lessonId",
  otherKey: "vocabularyId",
  as: "vocabularies"
});

db.Vocabulary.belongsToMany(db.Lesson, {
  through: db.LessonVocabulary,
  foreignKey: "vocabularyId",
  otherKey: "lessonId",
  as: "lessons"
});

// 📊 Progress tracking (FIXED STRUCTURE)
db.User.hasMany(db.Progress, {
  foreignKey: "userId",
  as: "progress"
});

db.Progress.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user"
});

db.Lesson.hasMany(db.Progress, {
  foreignKey: "lessonId",
  as: "progress"
});

db.Progress.belongsTo(db.Lesson, {
  foreignKey: "lessonId",
  as: "lesson"
});

db.Vocabulary.hasMany(db.Progress, {
  foreignKey: "vocabularyId",
  as: "progress"
});

db.Progress.belongsTo(db.Vocabulary, {
  foreignKey: "vocabularyId",
  as: "vocabulary"
});

// =====================
module.exports = db;