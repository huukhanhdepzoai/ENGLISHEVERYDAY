module.exports = (sequelize, DataTypes) => {
  const StudentClass = sequelize.define("StudentClass", {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: "StudentClasses",
    timestamps: false
  });

  return StudentClass;
};