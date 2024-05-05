const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/database");

const UrlMapping = sequelize.define(
  "UrlMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    longUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true, updatedAt: false }
);

module.exports = UrlMapping;
