module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define(
    "Progress",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      vocabularyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      isLearned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Progress",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Progress;
};