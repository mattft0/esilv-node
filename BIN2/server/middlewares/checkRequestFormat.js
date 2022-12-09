module.exports = function checkRequestFormat(req, res, next) {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.headers["content-type"]?.startsWith("application/json")) {
      res.sendStatus(400);
      return;
    }
  }
  next();
};
