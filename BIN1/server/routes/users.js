const { Router } = require("express");

let users = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@test.com",
    password: "123456",
  },
  {
    id: 2,
    firstname: "Jane",
    lastname: "Doe",
    email: "jane.doe@test.com",
    password: "123456",
  },
];
let currentId = 3;

const router = new Router();

// Get collection users
router.get("/users", (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

// Create a new user
router.post("/users", (req, res) => {
  console.log(req);
  if (req.headers["content-type"] !== "application/json") {
    res.sendStatus(400);
  } else if (req.body.password === "" || req.body.email === "") {
    const errors = {};
    if (req.body.password === "") errors.password = "must not be empty";
    if (req.body.email === "") errors.email = "must not be empty";
    res.status(422).json(errors);
  } else {
    const user = {
      id: currentId++,
      ...req.body,
    };
    users.push(user);
    res.status(201).json(user);
  }
});

// Get a specific user
router.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) {
    const { password, ...u } = user;
    res.json(u);
  } else {
    res.sendStatus(404);
  }
});

// Update a specific user
router.put("/users/:id", (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    res.sendStatus(400);
  } else {
    let user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      res.sendStatus(404);
    } else {
      if (req.body.email === "") {
        res.status(422).json({
          email: "must not be empty",
        });
      } else {
        user = {
          ...user,
          ...req.body,
        };
        users = users.map((u) => (u.id === user.id ? user : u));
        res.json(user);
      }
    }
  }
});

// DELETE a specific user
router.delete("/users/:id", (req, res) => {
  let index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    res.sendStatus(404);
  } else {
    users.splice(index, 1);
    res.sendStatus(204);
  }
});

module.exports = router;
