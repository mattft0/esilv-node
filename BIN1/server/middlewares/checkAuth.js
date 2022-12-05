const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "my-super-secret-64";

module.exports = function (options = {}) {
  return function (req, res, next) {
    const authorization = req.headers["authorization"];

    if (!authorization && options.anonymous) return next();

    if (!authorization) return res.sendStatus(401);

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") return res.sendStatus(401);

    try {
      const user = jwt.verify(token, SECRET);
      req.user = user;
      next();
    } catch (error) {
      res.sendStatus(401);
    }
  };
};
