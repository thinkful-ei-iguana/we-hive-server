const knex = require("knex");
const app = require("../../src/app");
const helpers = require("../test-helpers");
const bcrypt = require("bcryptjs");

let db;

before("make knex instance", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL
  });
  app.set("db", db);
});

const { testUsers } = helpers.makeHivesFixtures();

context("Given hive with hive_id", () => {
  it("GET /api/hives/:hive_id responds with 200 and the specified hive", () => {
    const hiveId = 1;
    const expectedHive = {
      id: 1,
      goal_type: 3,
      goal_description: "Goal 1 desc for type 3",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "Goal 1 group message",
      date_added: "2020-01-01T12:30:30.615Z"
    };

    return supertest(app)
      .get(`/api/hives/${hiveId}`)
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      })
      .expect(200, expectedHive);
  });

  it("GET /api/hives/:hive_id/members responds with 200 and the members of specified hive", () => {
    const hiveId = 2;
    const expectedMembers = [
      {
        id: 2,
        user_name: "test-user-2",
        first_name: "Test User 2",
        user_email: "tu2@gmail.com",
        password: "Password2!",
        date_created: "2020-01-01T12:30:30.615Z"
      }
    ];

    let promise = supertest(app)
      .get(`/api/hives/${hiveId}/members`)
      .set({
        authorization: helpers.makeAuthHeader(testUsers[1])
      });

    return promise.expect(200).expect(res => {
      db.from("users")
        .select("*")
        .where({ id: res.body[1].id })
        .then(row => {
          expect(row[0].first_name).to.eql(expectedMembers[0].first_name);
          expect(row[0].user_name).to.eql(expectedMembers[0].user_name);
          expect(row[0].user_email).to.eql(expectedMembers[0].user_email);
          return bcrypt.compare(expectedMembers[0].password, row[0].password);
        });
    });
  });

  it("GET /api/hives/:hive_id/activity responds with 200 and the activity of specified hive", () => {
    const hiveId = 2;
    const expectedActivity = [
      {
        id: 4,
        action: "first action for hive 2",
        notes: "first comment for hive 2",
        date_added: "2020-01-01T12:30:30.615Z",
        hive_id: 2,
        user_id: 1
      }
    ];

    let promise = supertest(app)
      .get(`/api/hives/${hiveId}/activity`)
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      });

    return promise.expect(200).expect(res => {
      db.from("hive_activity")
        .select("*")
        .where({ id: res.body[0].id })
        .then(row => {
          expect(row[0].action).to.eql(expectedActivity[0].action);
          expect(row[0].notes).to.eql(expectedActivity[0].notes);
        });
    });
  });
});
