const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit();
  }
};

module.exports = {
  sequelize,
  connectDB,
};
