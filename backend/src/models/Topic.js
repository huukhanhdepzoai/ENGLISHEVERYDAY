module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      topicName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Topics",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Topic;
};