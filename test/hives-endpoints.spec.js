const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Hives Endpoints", function() {
  let db;

  const {
    testUsers,
    testHives,
    testJoinHives,
    testActivity
  } = helpers.makeHivesFixtures();

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

  beforeEach("insert users and hives", () => {
    return helpers.seedHivesTables(
      db,
      testUsers,
      testHives,
      testJoinHives,
      testActivity
    );
  });

  describe("GET /api/hives", () => {
    require("./hiveTests/getHives.spec");
  });

  describe("GET /api/hives/user", () => {
    require("./hiveTests/getHivesUser.spec");
  });

  describe("POST /api/hives/code", () => {
    require("./hiveTests/postCode.spec");
  });

  describe("GET /api/hives/:hive_id", () => {
    require("./hiveTests/hiveIdTests.spec");
  });

  describe("PATCH /api/hives/:hive_id/code", () => {
    require("./hiveTests/patchCode.spec");
  });
});

describe("POST /api/hives", () => {
  let db;

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
  const { testUsers } = helpers.makeHivesFixtures();

  beforeEach("insert users", () => {
    return helpers.seedUsers(db, testUsers);
  });

  describe("POST /api/hives", () => {
    require("./hiveTests/postHives.spec");
  });
});
