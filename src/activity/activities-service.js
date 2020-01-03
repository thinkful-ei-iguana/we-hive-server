const ActivitiesService = {
  getAllActivities(db) {
    return db.select("*").from("hive_activity");
  },
  getActivityByUserId(db, user_id) {
    return db
      .from("hive_activity")
      .select("*")
      .where({ user_id });
  },
  insertActivity(db, newActivity) {
    return db
      .into("hive_activity")
      .insert(newActivity)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .from("hive_activity")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteActivity(db, id) {
    return db
      .from("hive_activity")
      .where({ id })
      .delete();
  },
  updateActivity(db, id, newActivityFields) {
    return db
      .from("hive_activity")
      .where({ id })
      .update(newActivityFields);
  }
};

module.exports = ActivitiesService;
