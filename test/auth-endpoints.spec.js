/* eslint-disable quotes */
const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Auth Endpoints", function() {
  let db;

  const testUsers = helpers.makeUsersArray();
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

    it(`responds 400 'Incorrect user email or password' when bad user_email`, () => {
      const invalidUserEmail = {
        user_email: "notanemail@gmail.com",
        password: "password"
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(invalidUserEmail)
        .expect(400, { error: "Incorrect user email or password" });
    });

    it(`responds 400 'Incorrect user email or password' when bad password`, () => {
      const invalidUserPass = {
        user_email: testUser.user_email,
        password: "wrongpassword"
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(invalidUserPass)
        .expect(400, { error: "Incorrect user email or password" });
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        user_email: testUser.user_email,
        password: testUser.password
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_email,
          algorithm: "HS256"
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken
        });
    });
  });
});
