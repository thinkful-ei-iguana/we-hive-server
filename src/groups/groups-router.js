const express = require("express");
const path = require("path");

const GroupsService = require("./groups-service");
const requireAuth = require("../middleware/jwt-auth");

const groupsRouter = express.Router();
const jsonParser = express.json();

groupsRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    GroupsService.getGroupsByUserId(req.app.get("db"), req.user.id)
      .then(goals => {
        res.json(goals.map(GroupsService.serializeGroup));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { date_created, group_url } = req.body;
    const newGroup = {
      group_url
    };

    newGroup.date_created = date_created;
    newGroup.user_id = req.user.id;

    GroupsService.insertGroup(req.app.get("db"), newGroup)
      .then(group => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${group.id}`))
          .json(GroupsService.serializeGroup(group));
      })
      .catch(next);
  });

groupsRouter
  .route("/:group_id")
  .all(requireAuth)
  .all(checkGroupExists)
  .get((req, res) => {
    res.json(serializeGroup(res.group));
  })
  .delete((req, res, next) => {
    GroupsService.deleteGroup(req.app.get("db"), req.params.group_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { group_url } = req.body;
    const newGroupFields = {
      group_url
    };

    const numberOfValues = Object.values(newGroupFields).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: "Request body must contain group url"
        }
      });
    GroupsService.updateGroup(
      req.app.get("db"),
      req.params.group_id,
      newGroupFields
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

groupsRouter
  .route("/:group_id/hive-mind")
  .all(requireAuth)
  .all(checkGroupExists)
  .get((req, res, next) => {
    GroupsService.getActivityForGroup(req.app.get("db"), req.params.group_id)
      .then(activity => {
        res.json(GroupsService.serializeGroupActivity(activity));
      })
      .catch(next);
  });
/* async/await syntax for promises */
async function checkGroupExists(req, res, next) {
  try {
    const group = await GroupsService.getById(
      req.app.get("db"),
      req.params.group_id
    );

    if (!group)
      return res.status(404).json({
        error: "Group doesn't exist"
      });

    res.group = group;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = groupsRouter;
