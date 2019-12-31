const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Users Endpoints", function() {
  let db;

  const testUsers = helpers.makeUsersArray();

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = [
        "first_name",
        "user_name",
        "user_email",
        "password"
      ];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: "test first_name",
          user_name: "test user_name",
          user_email: "test@gmail.com",
          password: "test password"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });
    });
  });
});
