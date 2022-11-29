const express = require("express");
const userRouter = require("./routes/users");

const app = express();

const PORT = process.env.PORT || 3000;

/**
 * Exemple Hello
 */
app.get("/hello", (request, response) => {
  response.send("coucou");
});
app.post("/hello", (req, res) => res.send("POST coucou"));
app.put("/hello/:id", (req, res) => res.send("PUT coucou " + req.params.id));
app.delete("/hello/:titi", (req, res) =>
  res.send("DELETE coucou " + req.params.titi)
);
app.use(express.json());
app.use(userRouter);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
