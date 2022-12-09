const { Router } = require("express");

const router = new Router();

let users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "1234" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "1234" },
];
let current = 3;

// Get collection
router.get("/users", (req, res) => {
  res.json(users);
});

// Créer un user
router.post("/users", (req, res) => {
  const user = {
    id: current++,
    ...req.body,
  };
  const errors = {};
  if (!user.password || user.password === "") {
    errors.password = "must not be empty";
  }
  if (!user.email || user.email === "") {
    errors.email = "must not be empty";
  }
  if (Object.keys(errors).length) {
    res.status(422).json(errors);
    return;
  }

  users.push(user);
  const { password, ...result } = user;

  res.status(201).json(result);
});

// Récupérer un user
router.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    res.sendStatus(404);
  } else {
    const { password, ...result } = user;
    res.json(result);
  }
});

// Update un user
router.put("/users/:id", (req, res) => {
  const userInput = req.body;
  const errors = {};
  if (userInput.password && userInput.password === "") {
    errors.password = "must not be empty";
  }
  if (userInput.email && userInput.email === "") {
    errors.email = "must not be empty";
  }
  if (Object.keys(errors).length) {
    res.status(422).json(errors);
    return;
  }
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    res.sendStatus(404);
  } else {
    users = users.map((u) =>
      u.id === parseInt(req.params.id)
        ? {
            ...u,
            ...userInput,
          }
        : u
    );
    const result = users.find((u) => u.id === user.id);
    res.json(result);
  }
});

// Delete un utilisateur
router.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    res.sendStatus(404);
  } else {
    users.splice(userIndex, 1);
    res.sendStatus(204);
  }
});

module.exports = router;
