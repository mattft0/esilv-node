const { Router } = require("express");

const router = new Router();

/**
 * Exemple Hello
 */
router.get("/hello", (request, response) => {
  response.send("coucou");
});
router.post("/hello", (req, res) => res.send("POST coucou"));
router.put("/hello/:id", (req, res) => res.send("PUT coucou " + req.params.id));
router.delete("/hello/:titi", (req, res) =>
  res.send("DELETE coucou " + req.params.titi)
);

module.exports = router;
