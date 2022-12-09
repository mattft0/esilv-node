const { Model, DataTypes } = require("sequelize");
const connection = require("./connection");

class Product extends Model {}

Product.init(
  {},
  {
    sequelize: connection,
  }
);

module.exports = Product;
