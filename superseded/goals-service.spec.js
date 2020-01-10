const GoalsService = require("../src/goals/goals-service");
const knex = require("knex");
const app = require("../src/app");
const helpers = require("../test/test-helpers");

describe.skip(`Goals service object`, function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];
  //add this to test helpers
  let testGoals = [
    {
      goal_type: "Stretch Goal",
      goal_description: "run a marathon",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "let's run together",
      user_id: 1
    },
    {
      goal_type: "Current Goal",
      goal_description: "run 1 mile",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "let's run together",
      user_id: 1
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => {
    return db.into("hive_users").insert(testUsers);
  });

  before(() => {
    return db.into("hive_goals").insert(testGoals);
  });

  after(() => db.destroy());

  describe("getAllGoals()", () => {
    it("resolves all goals from 'hive_goals' table", () => {
      return GoalsService.getAllGoals(db).then(actual => {
        expect(actual).to.eql(testGoals);
      });
    });
  });
});
