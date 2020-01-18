const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Hives Endpoints", function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testHives = helpers.makeHivesArray();
  const testJoinHives = helpers.makeHivesUsersArray();
  const testActivity = helpers.makeActivityArray();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean tables", () => helpers.cleanTables(db));

  afterEach("clean tables", () => helpers.cleanTables(db));

  describe("GET /api/hives", () => {
    context("Given no hives", () => {
      beforeEach("insert hives", () => {
        helpers.seedHivesTables(
          db,
          testUsers,
          testHives,
          testJoinHives,
          testActivity
        );
      });
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/hives")
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(200, []);
      });
    });
  });
});
