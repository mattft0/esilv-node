const express = require("express");
const userRouter = require("./routes/users");
const securityRouter = require("./routes/security");
const helloRouter = require("./routes/hello");
const checkRequestFormat = require("./middlewares/checkRequestFormat");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(express.json());

app.use(function monitor(req, res, next) {
  // Process request monitoring
  console.log("request", req.url);

  // Override default functions with monitored ones
  const jsonFnc = res.json;
  res.json = function (...args) {
    console.log("response", res.statusCode, JSON.stringify(args));
    return jsonFnc.call(res, ...args);
  };
  const sendStatusFnc = res.sendStatus;
  res.sendStatus = function (...args) {
    const result = sendStatusFnc.call(res, ...args);
    console.log("response", res.statusCode);
    return result;
  };

  next();
});

app.use(checkRequestFormat);

app.use(helloRouter);
app.use(securityRouter);
app.use(userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port " + PORT));
