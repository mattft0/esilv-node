const { Router } = require("express");
const checkAuth = require("../middlewares/checkAuth");
const { User } = require("../models");

const router = new Router();

// Get collection
router.get("/users", checkAuth, (req, res) => {
  User.findAll({
    where: req.query,
    attributes: { exclude: ["password"] },
  }).then((data) => res.json(data));
});

// Créer un user
router.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((data) => res.status(201).json(data))
    .catch((error) => {
      // manage error
      res.sendStatus(422);
    });
});

// Récupérer un user
router.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(parseInt(req.params.id), {
    attributes: { exclude: "password" },
  });
  if (!user) {
    res.sendStatus(404);
  } else {
    res.json(user);
  }
});

// Update un user
router.put("/users/:id", checkAuth, (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);

  User.update(req.body, {
    where: { id: parseInt(req.params.id) },
    individualHooks: true,
  })
    .then(([nbUpdated]) => {
      if (!nbUpdated) return res.sendStatus(404);
      User.findByPk(parseInt(req.params.id), {
        attributes: { exclude: "password" },
      }).then((user) => res.json(user));
    })
    .catch((error) => {
      // manage error
      res.sendStatus(422);
    });
});

// Delete un utilisateur
router.delete("/users/:id", checkAuth, (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);
  User.destroy({
    where: {
      id: parseInt(req.params.id),
    },
  }).then((nbDeleted) => {
    if (nbDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
