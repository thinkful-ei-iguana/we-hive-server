const app = require("../../src/app");
const helpers = require("../test-helpers");

const { testUsers } = helpers.makeHivesFixtures();

context("Given a new hive", () => {
  it("responds with 201 and the new hive", () => {
    const newHive = {
      id: 1,
      goal_type: 1,
      goal_description: "new desc",
      target_date: "2021-01-01T12:30:30.615Z",
      group_message: "new message",
      date_added: "2020-01-01T12:30:30.615Z"
    };

    return supertest(app)
      .post("/api/hives")
      .set({
        authorization: helpers.makeAuthHeader(testUsers[0])
      })
      .send(newHive)
      .expect(201)
      .expect(res => {
        expect(res.body.goal_type).to.eql(newHive.goal_type);
        expect(res.body.goal_description).to.eql(newHive.goal_description);
        expect(res.body.target_date).to.eql(newHive.target_date);
        expect(res.body.group_message).to.eql(newHive.group_message);
        expect(res.body.date_added).to.eql(newHive.date_added);
        expect(res.body).to.have.property("id");
        expect(res.headers.location).to.eql(`/api/hives/${res.body.id}`);
      })
      .then(postRes =>
        supertest(app)
          .get(`/api/hives/${postRes.body.id}`)
          .set({
            authorization: helpers.makeAuthHeader(testUsers[0])
          })
          .expect(postRes.body)
      );
  });
});
