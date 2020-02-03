const app = require("../../src/app");
const helpers = require("../test-helpers");

const { testUsers } = helpers.makeHivesFixtures();

context("Given existing user", () => {
  it("responds with 200 and the user", () => {
    const expectedUser = {
      id: 1,
      first_name: "Test User 1",
      user_email: "tu1@gmail.com"
    };
    return supertest(app)
      .get("/api/hives/user")
      .set("authorization", helpers.makeAuthHeader(testUsers[0]))
      .expect(200, expectedUser);
  });
});
