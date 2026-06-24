const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // PostgreSQL configuration for Render production environment
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      freezeTableName: true,
    },
    logging: false,
  });
} else {
  // Local Microsoft SQL Server configuration
  sequelize = new Sequelize(
    process.env.DB_NAME || "EnglishEverydayDB",
    process.env.DB_USER || "sa",
    process.env.DB_PASSWORD || "123456Aa@",
    {
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "mssql",
      define: {
        freezeTableName: true,
      },
      dialectOptions: {
        options: {
          instanceName: process.env.DB_INSTANCE || "SQLEXPRESS01",
          encrypt: false,
          trustServerCertificate: true,
        },
      },
      logging: false,
    }
  );
}

module.exports = sequelize;