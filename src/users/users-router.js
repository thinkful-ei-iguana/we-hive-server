const express = require("express");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post("/", jsonBodyParser, (req, res) => {
  const { first_name, user_name, user_email, password } = req.body;
  const newUser = { first_name, user_name, user_email, password };

  for (const [key, value] of Object.entries(newUser))
    if (!value) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
    }
});

module.exports = usersRouter;
