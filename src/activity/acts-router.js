const express = require("express");
const path = require("path");

const ActsService = require("./acts-service");
const requireAuth = require("../middleware/jwt-auth");

const actsRouter = express.Router();
const jsonParser = express.json();

actsRouter
  .route("/")
  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    const { action, notes, date_added, hive_id } = req.body;
    const newActivity = {
      hive_id
    };

    for (const [key, value] of Object.entries(newActivity))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    newActivity.action = action;
    newActivity.notes = notes;
    newActivity.date_added = date_added;
    newActivity.user_id = req.user.id;

    ActsService.insertActivity(req.app.get("db"), newActivity)
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(ActsService.serializeAct(activity));
      })
      .catch(next);
  });

module.exports = actsRouter;
