const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Auth Endpoints", function() {
  let db;

  const { testUsers } = helpers.makeHiveFixtures();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean tables", () => helpers.cleanTables(db));

  afterEach("clean tables", () => helpers.cleanTables(db));

  describe("POST /api/auth/login", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["user_email", "password"];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_email: testUser.user_email,
        password: testUser.password
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });
  });
});
