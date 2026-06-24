module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define("Lesson", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "Lessons",
    timestamps: false
  });

  return Lesson;
};