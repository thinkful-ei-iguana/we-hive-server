const express = require("express");
const AuthService = require("./auth-service");
const requireAuth = require("../middleware/jwt-auth");
const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .route("/login")
  .post(jsonBodyParser, (req, res, next) => {
    const { user_email, password } = req.body;
    const loginUser = { user_email, password };

    for (const [key, value] of Object.entries(loginUser))
      if (!value) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    AuthService.getUserWithUserEmail(req.app.get("db"), loginUser.user_email)

      .then(dbUser => {
        if (!dbUser) {
          return res.status(400).json({
            error: "Incorrect user email or password"
          });
        }
        return AuthService.comparePasswords(
          loginUser.password,
          dbUser.password
        ).then(compareMatch => {
          if (!compareMatch) {
            return res.status(400).json({
              error: "Incorrect user email or password"
            });
          }
          const sub = dbUser.user_email;
          const payload = { user_id: dbUser.id };

          res.send({
            authToken: AuthService.createJwt(sub, payload)
          });
        });
      })
      .catch(next);
  })
  .put(requireAuth, (req, res) => {
    const sub = req.user.user_email;
    const payload = {
      user_id: req.user.id,
      name: req.user.name
    };
    res.send({
      authToken: AuthService.createJwt(sub, payload)
    });
  });

module.exports = authRouter;
