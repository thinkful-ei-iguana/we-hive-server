const xss = require("xss");

const HivesService = {
  getAllHives(db) {
    return db.from("hives").select("*");
  },

  getHivesByUserId(db, user_id) {
    return db
      .from("hives")
      .select("*")
      .join("hives_users", "hives.id", "=", "hives_users.hive_id")
      .where({ user_id });
  },
  getHiveMembers(db, hive_id) {
    return db
      .from("users")
      .select("*")
      .join("hives_users", "users.id", "=", "hives_users.user_id")
      .where({ hive_id });
  },
  insertHive(db, newHive) {
    return db
      .insert(newHive)
      .into("hives")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  insertHiveUser(db, user_id, code) {
    return db
      .from("hives_users")
      .select("hive_id")
      .where({ code })
      .returning("hive_id")
      .then(res => {
        console.log(res);
        return db.into("hives_users").insert({
          hive_id: res[0].hive_id,
          user_id: user_id,
          code
        });
      });
  },
  insertHiveAndUserId(db, newHive, user_id) {
    return db
      .into("hives")
      .insert(newHive)
      .returning("id")
      .then(res => {
        return db
          .into("hives_users")
          .insert({ hive_id: res[0], user_id: user_id });
      });
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
      .from("hives")
      .select("*")
      .where("id", id)
      .first();
  },
  getByCode(db, code) {
    return db
      .from("hives_users")
      .select("hive_id")
      .where("code", code)
      .first();
  },
  getByIdFromJoin(db, hive_id) {
    return db
      .from("hives_users")
      .select("*")
      .where("hive_id", hive_id)
      .first();
  },
  deleteHive(db, id) {
    return db
      .from("hives")
      .where({ id })
      .delete();
  },
  updateHive(db, id, newHiveFields) {
    return db
      .from("hives")
      .where({ id })
      .update(newHiveFields);
  },
  updateHiveUsers(db, hive_id, code) {
    return db
      .from("hives_users")
      .where("hive_id", hive_id)
      .update(code);
  },
  getActivityForHive(db, hive_id) {
    return db
      .from("hive_activity")
      .select(
        "hive_activity.id",
        "hive_activity.action",
        "hive_activity.notes",
        "hive_activity.date_added",
        "hive_activity.hive_id",
        "hive_activity.user_id",
        "users.first_name"
      )
      .where("hive_id", hive_id)
      .leftJoin("users", "hive_activity.user_id", "=", "users.id");
  },
  serializeHives(hives) {
    return hives.map(this.serializeHive);
  },
  serializeHive(hive) {
    return {
      id: hive.id,
      private: hive.private,
      goal_type: hive.goal_type,
      goal_description: xss(hive.goal_description),
      target_date: xss(hive.target_date),
      group_message: xss(hive.group_message),
      date_added: hive.date_added
    };
  },
  serializeHiveActivity(activity) {
    return {
      id: activity.id,
      action: xss(activity.action),
      notes: xss(activity.notes),
      date_added: activity.date_added,
      hive_id: activity.hive_id,
      user_id: activity.user_id,
      user: activity.first_name
    };
  },
  serializeHiveUser(hiveUser) {
    return {
      hive_id: hiveUser.hive_id,
      user_id: hiveUser.user_id,
      code: hiveUser.code
    };
  }
};

module.exports = HivesService;
