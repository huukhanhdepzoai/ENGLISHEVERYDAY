module.exports = (sequelize, DataTypes) => {
  const Vocabulary = sequelize.define(
    "Vocabulary",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      word: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      meaning: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      exampleSentence: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      pronunciation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      topicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
        tableName: "Vocabulary",   // 🔥 QUAN TRỌNG
         freezeTableName: true,     // 🔥 CHẶN PLURAL
         timestamps: false,
    }
  );

  return Vocabulary;
};