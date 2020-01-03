const GroupsService = {
  getAllGroups(db) {
    return db.select("*").from("hive_groups");
  },
  getGroupsByUserId(db, user_id) {
    return db
      .from("hive_groups")
      .select("*")
      .where({ user_id });
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
  }
};

module.exports = GroupsService;
