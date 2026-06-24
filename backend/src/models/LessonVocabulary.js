module.exports = (sequelize, DataTypes) => {
  const LessonVocabulary = sequelize.define("LessonVocabulary", {
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },

    vocabularyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: "LessonVocabularies",
    timestamps: false
  });

  return LessonVocabulary;
};