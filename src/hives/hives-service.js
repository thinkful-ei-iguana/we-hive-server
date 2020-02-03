const xss = require("xss");

const HivesService = {
  getLoggedInUser(db, id) {
    return db
      .from("users")
      .select("*")
      .where({ id })
      .then(rows => {
        return rows[0];
      });
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
      .join("hives_users", "users.id", "=", "hives_users.user_id");
  },
  insertHiveUser(db, user_id, code) {
    return db
      .from("hives_users")
      .select("hive_id")
      .where({ code })
      .returning("hive_id")
      .then(res => {
        return db.into("hives_users").insert({
          hive_id: res[0].hive_id,
          user_id: user_id
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
  getById(db, id) {
    return db
      .from("hives")
      .select("*")
      .where("id", id)
      .first();
  },

  updateHiveUsers(db, hive_id, user_id, code) {
    return db
      .from("hives_users")
      .where("hive_id", hive_id)
      .where("user_id", user_id)
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
      goal_type: hive.goal_type,
      goal_description: hive.goal_description,
      target_date: hive.target_date,
      group_message: hive.group_message,
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
      user_id: hiveUser.user_id
    };
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: user.first_name,
      user_email: user.user_email
    };
  }
};

module.exports = HivesService;
