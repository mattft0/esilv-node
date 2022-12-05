const { Router } = require("express");
const { User } = require("../models");
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");
const router = new Router();

// Get collection users
router.get(
  "/users",
  checkAuth(),
  checkRole(checkRole.ROLES.ADMIN),
  async (req, res) => {
    const users = await User.findAll({
      where: req.query,
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  }
);

// Create a new user
router.post(
  "/users",
  checkAuth({ anonymous: true }),
  checkRole(checkRole.ROLES.ADMIN, {
    anonymous: true,
    securedFields: ["role"],
  }),
  async (req, res, next) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      console.log("Here");
      next(error);
    }
  }
);

// Get a specific user
router.get("/users/:id", checkAuth(), async (req, res) => {
  const user = await User.findByPk(parseInt(req.params.id), {
    attributes: { exclude: ["password"] },
  });
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

// Update a specific user
router.put(
  "/users/:id",
  checkAuth(),
  checkRole(checkRole.ROLES.ADMIN, {
    securedFields: ["role"],
  }),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (req.user.id !== id) {
        return res.sendStatus(403);
      }
      const [nbUpdated] = await User.update(req.body, {
        where: {
          id,
        },
        individualHooks: true,
      });
      if (!nbUpdated) {
        res.sendStatus(404);
      } else {
        res.json(
          await User.findByPk(id, { attributes: { exclude: ["password"] } })
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE a specific user
router.delete("/users/:id", checkAuth(), async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.sendStatus(403);
  }
  const nbDeleted = await User.destroy({
    where: {
      id,
    },
  });
  res.sendStatus(!nbDeleted ? 404 : 204);
});

module.exports = router;
