/* eslint-disable quotes */
const app = require("../../src/app");
const helpers = require("../test-helpers");

const { testUsers } = helpers.makeHivesFixtures();

context("Given code exists in join table", () => {
  it("responds with 201 and adds new user_id to the join table with corresponding hive_id that matches the given code", () => {
    const joinCode = {
      hive_id: 2,
      user_id: testUsers[0],
      code: "testpass"
    };

    return supertest(app)
      .post("/api/hives/code")
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      })
      .send(joinCode)
      .expect(201);
  });
});
