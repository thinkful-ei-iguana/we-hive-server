const express = require("express");
const path = require("path");
const xss = require("xss");
const GoalsService = require("./goals-service");
const requireAuth = require("../../src/middleware/jwt-auth");

const goalsRouter = express.Router();
const jsonParser = express.json();

const serializeGoal = goal => ({
  id: goal.id,
  private: goal.private,
  goal_type: goal.goal_type,
  goal_description: xss(goal.goal_description),
  target_date: goal.target_date,
  group_message: goal.group_message,
  date_added: goal.date_added,
  user_id: goal.user_id
});

goalsRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    GoalsService.getGoalsByUserId(req.app.get("db"), req.user.id)
      .then(goals => {
        res.json(goals.map(serializeGoal));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      goal_type,
      goal_description,
      target_date,
      group_message,
      date_added
    } = req.body;
    const newGoal = {
      goal_type,
      goal_description,
      target_date
    };

    for (const [key, value] of Object.entries(newGoal))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    newGoal.group_message = group_message;
    newGoal.date_added = date_added;
    newGoal.user_id = req.user.id;

    GoalsService.insertGoal(req.app.get("db"), newGoal)
      .then(goal => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${goal.id}`))
          .json(serializeGoal(goal));
      })
      .catch(next);
  });

goalsRouter
  .route("/:goal_id")
  .all(requireAuth)
  .all((req, res, next) => {
    GoalsService.getById(req.app.get("db"), req.params.goal_id)
      .then(goal => {
        if (!goal) {
          return res.status(404).json({
            error: { message: "Goal doesn't exist" }
          });
        }
        res.goal = goal;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeGoal(res.goal));
  })
  .delete((req, res, next) => {
    GoalsService.deleteGoal(req.app.get("db"), req.params.goal_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      private,
      goal_type,
      goal_description,
      target_date,
      date_added,
      user_id
    } = req.body;
    const newGoalFields = {
      private,
      goal_type,
      goal_description,
      target_date,
      date_added,
      user_id
    };

    const numberOfValues = Object.values(newGoalFields).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain private goal_type, goal_description, target_date, date_added or user_id"
        }
      });
    GoalsService.updateGoal(
      req.app.get("db"),
      req.params.goal_id,
      newGoalFields
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = goalsRouter;
