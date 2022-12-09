const express = require("express");
const userRouter = require("./routes/users");
const securityRouter = require("./routes/security");
const helloRouter = require("./routes/hello");
const checkRequestFormat = require("./middlewares/checkRequestFormat");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(checkRequestFormat);
app.use(express.json());

app.use(helloRouter);
app.use(securityRouter);
app.use(userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port " + PORT));
