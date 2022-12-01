module.exports = (request, response, next) => {
  if (request.method === "POST" || request.method === "PUT") {
    if (!request.headers["content-type"]?.startsWith("application/json")) {
      return response.sendStatus(400);
    }
  }
  next();
};
