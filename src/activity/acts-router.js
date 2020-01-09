const express = require("express");
const path = require("path");

const ActsService = require("./acts-service");
const requireAuth = require("../middleware/jwt-auth");

const actsRouter = express.Router();
const jsonParser = express.json();

actsRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    ActsService.getAllActivities(req.app.get("db"))
      .then(acts => {
        res.json(acts.map(ActsService.serializeAct));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      action,
      timer,
      rating,
      private,
      notes,
      reminders,
      date_added,
      hive_id
    } = req.body;
    const newActivity = {
      hive_id
    };

    for (const [key, value] of Object.entries(newActivity))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    newActivity.action = action;
    newActivity.timer = timer;
    newActivity.rating = rating;
    newActivity.private = private;
    newActivity.notes = notes;
    newActivity.reminders = reminders;
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

actsRouter
  .route("/:activity_id")
  .all(requireAuth)
  .all((req, res, next) => {
    ActsService.getById(req.app.get("db"), req.params.activity_id)
      .then(activity => {
        if (!activity) {
          return res.status(404).json({
            error: { message: "Activity doesn't exist" }
          });
        }
        res.activity = activity;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(ActsService.serializeAct(res.activity));
  })
  .delete((req, res, next) => {
    ActsService.deleteActivity(req.app.get("db"), req.params.activity_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      action,
      timer,
      rating,
      private,
      notes,
      reminders,
      date_added
    } = req.body;
    const activityToUpdate = {
      action,
      timer,
      rating,
      private,
      notes,
      reminders,
      date_added
    };

    const numberOfValues = Object.values(activityToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain 'action', 'timer', 'rating', 'private', 'notes', 'reminders', or 'date_added'"
        }
      });
    ActsService.updateActivity(
      req.app.get("db"),
      req.params.activity_id,
      activityToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = actsRouter;
