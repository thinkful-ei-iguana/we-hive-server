const app = require("../../src/app");
const helpers = require("../test-helpers");

const { testUsers } = helpers.makeHivesFixtures();

context("Given no hives", () => {
  it("responds with 200 and an empty list", () => {
    return supertest(app)
      .get("/api/hives")
      .set({
        authorization: helpers.makeAuthHeader(testUsers[2])
      })
      .expect(200, []);
  });
});
context("Given user has hives", () => {
  it("responds with 200 and user's hives", () => {
    const expectedHives = [
      {
        id: 1,
        goal_type: 3,
        goal_description: "Goal 1 desc for type 3",
        target_date: "2020-01-01T12:30:30.615Z",
        group_message: "Goal 1 group message",
        date_added: "2020-01-01T12:30:30.615Z"
      },
      {
        id: 3,
        goal_type: 1,
        goal_description: "Goal 3 desc for type 1",
        target_date: "2020-01-01T12:30:30.615Z",
        group_message: "",
        date_added: "2020-01-01T12:30:30.615Z"
      }
    ];
    return supertest(app)
      .get("/api/hives")
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      })
      .expect(200, expectedHives);
  });
});
