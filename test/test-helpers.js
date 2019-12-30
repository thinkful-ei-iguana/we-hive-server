const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      first_name: "Test User 1",
      user_email: "tu1@gmail.com",
      password: "password",
      date_created: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 2,
      user_name: "test-user-2",
      first_name: "Test User 2",
      user_email: "tu2@gmail.com",
      password: "password",
      date_created: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 3,
      user_name: "test-user-3",
      first_name: "Test User 3",
      user_email: "tu3@gmail.com",
      password: "password",
      date_created: "2020-01-01T12:30:30.615Z"
    }
  ];
}

function makeHiveFixtures() {
  const testUsers = makeUsersArray();
  return { testUsers };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(`TRUNCATE hive_users`)
      .then(() =>
        Promise.all([trx.raw(`SELECT setval('hive_users_id_seq', 1)`)])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("hive_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('hive_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

module.exports = {
  makeUsersArray,
  makeHiveFixtures,
  cleanTables,
  seedUsers
};
