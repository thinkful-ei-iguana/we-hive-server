const express = require("express");
const path = require("path");
const xss = require("xss");
const HiveActsService = require("./hive-acts-service");
const requireAuth = require("../middleware/jwt-auth");

const groupActivitiesRouter = express.Router();
const jsonParser = express.json();

const serializeHiveAct = hiveAct => ({
  id: hiveAct.id,
  action: xss(hiveAct.action),
  comment: xss(hiveAct.comment),
  milestone: xss(hiveAct.milestone),
  date_created: hiveAct.date_created,
  group_id: hiveAct.group_id,
  user_id: hiveAct.user_id
});

groupActivitiesRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    HiveActsService.getAllActivities(req.app.get("db"))
      .then(acts => {
        res.json(acts.map(serializeHiveAct));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { action, comment, milestone, date_created, group_id } = req.body;
    const newGroupActivity = {
      group_id
    };

    newGroupActivity.action = action;
    newGroupActivity.comment = comment;
    newGroupActivity.milestone = milestone;
    newGroupActivity.date_created = date_created;
    newGroupActivity.user_id = req.user.id;

    HiveActsService.insertActivity(req.app.get("db"), newGroupActivity)
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(serializeHiveAct(activity));
      })
      .catch(next);
  });

groupActivitiesRouter
  .route("/:group_id")
  .all(requireAuth)
  .all((req, res, next) => {
    HiveActsService.getById(req.app.get("db"), req.params.group_id)
      .then(group => {
        if (!group) {
          return res.status(404).json({
            error: { message: "Group doesn't exist" }
          });
        }
        res.group = group;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeHiveAct(res.group));
  })
  .delete((req, res, next) => {
    HiveActsService.deleteActivity(req.app.get("db"), req.params.group_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { action, comment, milestone } = req.body;
    const newGroupActivityFields = {
      action,
      comment,
      milestone
    };

    const numberOfValues = Object.values(newGroupActivityFields).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain 'action', 'comment' or 'milestone'"
        }
      });
    HiveActsService.updateActivity(
      req.app.get("db"),
      req.params.group_id,
      newGroupActivityFields
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = groupActivitiesRouter;
