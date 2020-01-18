const xss = require("xss");

const ActsService = {
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
  serializeAct(act) {
    return {
      id: act.id,
      action: xss(act.action),
      notes: xss(act.notes),
      date_added: act.date_created,
      hive_id: act.hive_id,
      user_id: act.user_id
    };
  }
};

module.exports = ActsService;
