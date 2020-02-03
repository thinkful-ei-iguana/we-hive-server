/* eslint-disable quotes */
const app = require("../../src/app");
const helpers = require("../test-helpers");

const { testUsers } = helpers.makeHivesFixtures();

context("Given null code for existing hive", () => {
  it("responds with 204 and adds the patched code to that hive with hive_id and logged in user", () => {
    const hiveId = 2;
    const joinCode = {
      code: "testpass"
    };

    return supertest(app)
      .patch(`/api/hives/${hiveId}/code`)
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      })
      .send(joinCode)
      .expect(204);
  });
});
