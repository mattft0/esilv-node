const { ValidationError } = require("sequelize");

module.exports = function (error, req, res, next) {
  console.log(error, error instanceof ValidationError);
  if (error instanceof ValidationError) {
    res.status(422).json(
      error.errors.reduce((acc, item) => {
        acc[item.path] = [...(acc[item.path] || []), item.message];
        return acc;
      }, {})
    );
  } else {
    console.error(error);
    res.sendStatus(500);
  }
};
