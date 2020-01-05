const Treeize = require("treeize");
const xss = require("xss");

const GroupsService = {
  getGroupsByUserId(db, hive_user_id) {
    return db
      .from("hive_groups")
      .select(
        "hive_groups.id",
        "hive_groups.date_created",
        "hive_groups.group_url",
        ...userFields,
        db.raw("count(DISTINCT hive_groups.id) AS number_of_hives")
      )
      .where("hive_users.id", hive_user_id)
      .leftJoin("hive_users", "hive_groups.user_id", "hive_users.id")
      .leftJoin("hive_activity", "hive_groups.id", "hive_activity.group_id")
      .groupBy("hive_groups.id", "hive_users.id");
  },
  insertGroup(db, newGroup) {
    return db
      .into("hive_groups")
      .insert(newGroup)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .from("hive_groups")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteGroup(db, id) {
    return db
      .from("hive_groups")
      .where({ id })
      .delete();
  },
  updateGroup(db, id, newGroupFields) {
    return db
      .from("hive_groups")
      .where({ id })
      .update(newGroupFields);
  },
  getActivityForGroup(db, group_id) {
    return db
      .from("hive_activity")
      .select(
        "hive_activity.id",
        "hive_activity.action",
        "hive_activity.comment",
        "hive_activity.milestone",
        "hive_activity.date_created",
        ...userFields
      )
      .where("hive_activity.group_id", group_id)
      .leftJoin("hive_users", "hive_activity.user_id", "hive_users.id")
      .groupBy("hive_activity.id", "hive_users.id");
  },
  serializeGroup(group) {
    const groupTree = new Treeize();
    const groupData = groupTree.grow([group]).getData()[0];
    return {
      id: groupData.id,
      date_created: groupData.date_created,
      group_url: xss(groupData.group_url),
      user: groupData.user || {},
      number_of_hives: Number(groupData.number_of_hives) || 0
    };
  },
  serializeGroupActivity(activity) {
    const groupActivityTree = new Treeize();
    const groupActivityData = groupActivityTree.grow([activity]).getData()[0];

    return {
      id: groupActivityData.id,
      action: xss(groupActivityData.action),
      comment: xss(groupActivityData.comment),
      milestone: xss(groupActivityData.milestone),
      date_created: groupActivityData.date_created,
      group_id: groupActivityData.group_id,
      user: groupActivityData.user || {}
    };
  }
};

const userFields = [
  "hive_users.id AS user:id",
  "hive_users.user_name AS user:user_name",
  "hive_users.first_name AS user:first_name",
  "hive_users.user_email AS user:user_email",
  "hive_users.date_created AS user:date_created"
];

module.exports = GroupsService;
