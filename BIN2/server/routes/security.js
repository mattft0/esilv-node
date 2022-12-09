const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = new Router();
const SECRET = process.env.JWT_SECRET || "xghfcyuiotèr§ueydsdhgfxcgvjhbj";

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.sendStatus(401);
  if (!(await bcrypt.compare(req.body.password, user.password)))
    return res.sendStatus(401);

  res.json({
    token: jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      },
      SECRET
    ),
  });
});

module.exports = router;
