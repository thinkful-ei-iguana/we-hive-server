const GoalsService = {
  getAllGoals(db) {
    return db.select("*").from("hive_goals");
  },
  insertGoal(db, newGoal) {
    return db.insert(newGoal).into("hive_goals");
  },
  getById(db, id) {
    return db
      .from("hive_goals")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteGoal(db, id) {
    return db("hive_goals")
      .where({ id })
      .delete();
  },
  updateGoal(db, id, newGoalFields) {
    return db("hive_goals")
      .where({ id })
      .update(newGoalFields);
  }
};

module.exports = GoalsService;
