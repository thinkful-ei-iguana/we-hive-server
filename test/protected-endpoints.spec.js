const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Protected Endpoints", function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testHives = helpers.makeHivesArray();
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

  beforeEach("insert hives", () =>
    helpers.seedHivesTables(db, testUsers, testHives, testActivity)
  );

  const protectedEndpoints = [
    {
      name: "GET /api/hives/user",
      path: "/api/hives/user",
      method: supertest(app).get
    },
    {
      name: "GET /api/hives",
      path: "/api/hives",
      method: supertest(app).get
    },
    {
      name: "POST /api/hives",
      path: "/api/hives",
      method: supertest(app).post
    },
    {
      name: "POST /api/hives/code",
      path: "/api/hives/code",
      method: supertest(app).post
    },
    {
      name: "GET /api/hives/:hive_id",
      path: "/api/hives/1",
      method: supertest(app).get
    },
    {
      name: "PATCH /api/hives/:hive_id/code",
      path: "/api/hives/1/code",
      method: supertest(app).patch
    },
    {
      name: "GET /api/hives/:hive_id/members",
      path: "/api/hives/1/members",
      method: supertest(app).get
    },
    {
      name: "GET /api/hives/:hive_id/activity",
      path: "/api/hives/1/activity",
      method: supertest(app).get
    },
    {
      name: "POST /api/activity",
      path: "/api/activity",
      method: supertest(app).post
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it("responds with 401 'Missing bearer token' when no bearer token", () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: "Missing bearer token" });
      });

      it("responds 401 'Unauthorized request' when invalid JWT secret", () => {
        const validUser = testUsers[0];
        const invalidSecret = "incorrect";
        return endpoint
          .method(endpoint.path)
          .set(
            "Authorization",
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: "Unauthorized request" });
      });
      it("responds 401 'Unauthorized request' when invalid sub in payload", () => {
        const invalidUser = { user_email: "idonotexist@gmail.com", id: 1 };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: "Unauthorized request" });
      });
    });
  });
});
