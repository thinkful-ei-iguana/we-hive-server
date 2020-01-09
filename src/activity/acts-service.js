const xss = require("xss");

const ActsService = {
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
      .then(([activity]) => activity)
      .then(activity => ActsService.getById(db, activity.id));
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
  },
  serializeAct(act) {
    return {
      id: act.id,
      action: xss(act.action),
      timer: act.timer,
      rating: act.rating,
      private: act.private,
      notes: xss(act.notes),
      reminders: xss(act.reminders),
      date_added: act.date_created,
      hive_id: act.hive_id,
      user_id: act.user_id
    };
  }
};

module.exports = ActsService;
