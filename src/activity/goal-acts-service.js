const GoalActsService = {
  getAllActivities(db) {
    return db.select("*").from("goal_activity");
  },
  getActivityByUserId(db, user_id) {
    return db
      .from("goal_activity")
      .select("*")
      .where({ user_id });
  },
  insertActivity(db, newActivity) {
    return db
      .into("goal_activity")
      .insert(newActivity)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .from("goal_activity")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteActivity(db, id) {
    return db
      .from("goal_activity")
      .where({ id })
      .delete();
  },
  updateActivity(db, id, newActivityFields) {
    return db
      .from("goal_activity")
      .where({ id })
      .update(newActivityFields);
  }
};

module.exports = GoalActsService;
