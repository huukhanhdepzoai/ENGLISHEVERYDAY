const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "EnglishEverydayDB",
  process.env.DB_USER || "sa",
  process.env.DB_PASSWORD || "123456Aa@",
  {
    host: process.env.DB_HOST || "DESKTOP-HGTSJGP",
    dialect: "mssql",

    //  FIX QUAN TRỌNG: chặn plural table name
    define: {
      freezeTableName: true
    },

    dialectOptions: {
      options: {
        instanceName: process.env.DB_INSTANCE || "SQLEXPRESS01",
        encrypt: false,
        trustServerCertificate: true
      }
    },

    //  giảm lỗi sync ALTER trên SQL Server
    logging: false
  }
);

module.exports = sequelize;