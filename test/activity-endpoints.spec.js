/* eslint-disable quotes */
const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Activity Endpoints", function() {
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

  beforeEach("insert hives", () =>
    helpers.seedHivesTables(
      db,
      testUsers,
      testHives,
      testJoinHives,
      testActivity
    )
  );

  describe("POST /api/activity", () => {
    const { testUsers } = helpers.makeHivesFixtures();
    it(`responds with 201 and hive activity`, () => {
      const hiveActivity = {
        id: 5,
        action: "action 1",
        notes: "notes 1",
        hive_id: 1,
        user_id: 1
      };

      return supertest(app)
        .post("/api/activity")
        .set({
          authorization: helpers.makeAuthHeader(testUsers[0])
        })
        .send(hiveActivity)
        .expect(201)
        .expect(res => {
          expect(res.body.action).to.eql(hiveActivity.action);
          expect(res.body.notes).to.eql(hiveActivity.notes);
          expect(res.body.hive_id).to.eql(hiveActivity.hive_id);
          expect(res.body.user_id).to.eql(hiveActivity.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/activity/${res.body.id}`);
        })
        .then(postRes => {
          supertest(app)
            .get(`/api/activity/${postRes.body.id}`)
            .set({
              authorization: helpers.makeAuthHeader(testUsers[0])
            })
            .expect(postRes.body);
        });
    });
  });
});
