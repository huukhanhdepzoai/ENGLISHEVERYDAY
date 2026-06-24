module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("Class", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    className: {
      type: DataTypes.STRING,
      allowNull: false
    },

    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "Classes",
    timestamps: false
  });

  return Class;
};