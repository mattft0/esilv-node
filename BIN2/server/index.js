const express = require("express");
const userRouter = require("./routes/users");
const securityRouter = require("./routes/security");
const checkRequestFormat = require("./middlewares/checkRequestFormat");
const app = express();

app.use(checkRequestFormat);

app.use(express.json());

app.get("/hello", (request, response) => {
  response.json({ msg: "Coucou", method: "get" });
});
app.post("/hello", (request, response) => {
  response.json({
    msg: "coucou",
    method: "post",
  });
});

app.put("/hello/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json({
    msg: "coucou " + id,
    method: "put",
    dest: id,
  });
});
app.delete("/hello/:toto", (req, res) => {
  const id = req.params.toto;
  res.json({
    msg: "coucou " + id,
    method: "delete",
    dest: id,
  });
});
app.use(securityRouter);

app.use(userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port " + PORT));
