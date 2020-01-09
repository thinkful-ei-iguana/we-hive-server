const express = require("express");
const path = require("path");

const HivesService = require("./hives-service");
const requireAuth = require("../middleware/jwt-auth");

const hivesRouter = express.Router();
const jsonParser = express.json();

hivesRouter
  .route("/user")
  .all(requireAuth)
  .get((req, res, next) => {
    HivesService.getLoggedInUser(req.app.get("db"), req.user.id)
      .then(user => {
        res.json(HivesService.serializeUser(user));
      })
      .catch(next);
  });

hivesRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    HivesService.getHivesByUserId(req.app.get("db"), req.user.id)
      .then(hives => {
        res.json(hives.map(HivesService.serializeHive));
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
    const newHive = {
      goal_type,
      goal_description,
      target_date
    };

    for (const [key, value] of Object.entries(newHive))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    newHive.group_message = group_message;
    newHive.date_added = date_added;

    HivesService.insertHiveAndUserId(req.app.get("db"), newHive, req.user.id)
      .then(hive => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${hive.id}`))
          .json(HivesService.serializeHive(hive));
      })
      .catch(next);
  });
hivesRouter
  .route("/code")
  .all(requireAuth)
  // .all(checkCodeExists)
  .post(jsonParser, (req, res, next) => {
    const { code } = req.body;

    for (const [key, value] of Object.entries(code))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    HivesService.insertHiveUser(req.app.get("db"), req.user.id, code)
      .then(hiveUser => {
        res.status(201).json(HivesService.serializeHiveUser(hiveUser));
      })
      .catch(next);
  });
hivesRouter
  .route("/:hive_id")
  .all(requireAuth)
  .all(checkHiveExists)
  .get((req, res) => {
    res.json(HivesService.serializeHive(res.hive));
  })
  .delete((req, res, next) => {
    HivesService.deleteHive(req.app.get("db"), req.params.hive_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      goal_type,
      goal_description,
      target_date,
      group_message
    } = req.body;
    const newHiveFields = {
      goal_type,
      goal_description,
      target_date,
      group_message
    };

    const numberOfValues = Object.values(newHiveFields).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain 'goal_type', 'goal_description','target_date', or 'group_message'"
        }
      });
    HivesService.updateHive(
      req.app.get("db"),
      req.params.hive_id,
      newHiveFields
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

hivesRouter
  .route("/:hive_id")
  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    const {
      action,
      timer,
      rating,
      private,
      notes,
      reminders,
      date_added
    } = req.body;
    const newActivity = {
      action
    };

    for (const [key, value] of Object.entries(newActivity))
      if (!value)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });

    newActivity.timer = timer;
    newActivity.rating = rating;
    newActivity.private = private;
    newActivity.notes = notes;
    newActivity.reminders = reminders;
    newActivity.date_added = date_added;
    newActivity.user_id = req.user.id;

    HivesService.insertActivity(req.app.get("db"), newActivity)
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(HivesService.serializeAct(activity));
      })
      .catch(next);
  });

hivesRouter
  .route("/:hive_id/code")
  .all(requireAuth)
  .all(checkHiveExists)
  .patch(jsonParser, (req, res, next) => {
    const { code } = req.body;
    const addCode = {
      code
    };

    const numberOfValues = Object.values(addCode).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: "Request body must contain 'code'"
        }
      });
    HivesService.updateHiveUsers(req.app.get("db"), req.params.hive_id, addCode)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

hivesRouter
  .route("/:hive_id/members")
  .all(requireAuth)
  .all(checkHiveExists)
  .get((req, res, next) => {
    HivesService.getHiveMembers(req.app.get("db"), req.params.hive_id)
      .then(members => {
        res.status(200).json(members);
      })
      .catch(next);
  });
hivesRouter
  .route("/:hive_id/activity")
  .all(requireAuth)
  .all(checkHiveExists)
  .get((req, res, next) => {
    HivesService.getActivityForHive(req.app.get("db"), req.params.hive_id)
      .then(act => {
        res.json(act.map(HivesService.serializeHiveActivity));
      })
      .catch(next);
  });
/* async/await syntax for promises */
async function checkHiveExists(req, res, next) {
  try {
    const hive = await HivesService.getById(
      req.app.get("db"),
      req.params.hive_id
    );

    if (!hive)
      return res.status(404).json({
        error: "Hive doesn't exist"
      });

    res.hive = hive;
    next();
  } catch (error) {
    next(error);
  }
}
async function checkCodeExists(req, res, next) {
  try {
    const code = await HivesService.getByCode(req.app.get("db"), req.body.code);

    if (!code)
      return res.status(404).json({
        error: "Incorrect password"
      });

    res.code = code;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = hivesRouter;
