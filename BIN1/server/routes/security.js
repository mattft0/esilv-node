const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = new Router();

const SECRET = process.env.JWT_SECRET || "my-super-secret-64";

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.sendStatus(401);
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        token: jwt.sign(
          {
            lastname: user.lastname,
            firstname: user.firstname,
            role: user.role,
            id: user.id,
          },
          SECRET
        ),
      });
    } else {
      res.sendStatus(401);
    }
  }
});

module.exports = router;
