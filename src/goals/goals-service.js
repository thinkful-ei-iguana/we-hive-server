const GoalsService = {
  getAllGoals(db) {
    return db.select("*").from("hive_goals");
  },
  getGoalsByUserId(db, user_id) {
    return db
      .from("hive_goals")
      .select("*")
      .where({ user_id });
  },
  insertGoal(db, newGoal) {
    return db
      .into("hive_goals")
      .insert(newGoal)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .from("hive_goals")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteGoal(db, id) {
    return db
      .from("hive_goals")
      .where({ id })
      .delete();
  },
  updateGoal(db, id, newGoalFields) {
    return db
      .from("hive_goals")
      .where({ id })
      .update(newGoalFields);
  }
};

module.exports = GoalsService;
