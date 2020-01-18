const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      first_name: "Test User 1",
      user_email: "tu1@gmail.com",
      password: "Password1!",
      date_created: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 2,
      user_name: "test-user-2",
      first_name: "Test User 2",
      user_email: "tu2@gmail.com",
      password: "Password2!",
      date_created: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 3,
      user_name: "test-user-3",
      first_name: "Test User 3",
      user_email: "tu3@gmail.com",
      password: "Password3!",
      date_created: "2020-01-01T12:30:30.615Z"
    }
  ];
}

function makeHivesArray() {
  return [
    {
      id: 1,
      goal_type: 3,
      goal_description: "run a marathon",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "let's run together",
      date_added: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 2,
      goal_type: 2,
      goal_description: "run 1 mile",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "let's run together",
      date_added: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 3,
      goal_type: 1,
      goal_description: "Scotland trip",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "",
      date_added: "2020-01-01T12:30:30.615Z"
    }
  ];
}

function makeHivesUsersArray() {
  return [
    {
      hive_id: 1,
      user_id: 1
    },
    {
      hive_id: 1,
      user_id: 2
    },
    {
      hive_id: 2,
      user_id: 1
    },
    {
      hive_id: 2,
      user_id: 2
    }
  ];
}

function makeActivityArray() {
  return [
    {
      action: "action for hive 1",
      notes: "comment for hive 1",
      hive_id: 1,
      user_id: 1
    },
    {
      action: "another action for hive 1",
      notes: "another comment for hive 1",
      hive_id: 1,
      user_id: 2
    },
    {
      action: "third action for hive 1",
      notes: "third comment for hive 1",
      hive_id: 1,
      user_id: 3
    }
  ];
}

function makeExpectedHive(hive) {
  return {
    id: hive.id,
    goal_type: hive.goal_type,
    goal_description: hive.goal_description,
    target_date: hive.target_date,
    group_message: hive.group_message,
    date_added: hive.date_added
  };
}

function makeExpectedJoinHive(user, hive) {
  return {
    hive_id: hive.id,
    user_id: user.id
  };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(`TRUNCATE hive_activity, hives_users, hives, users`)
      .then(() =>
        Promise.all([
          trx.raw(`SELECT setval('hive_activity_id_seq', 1)`),
          trx.raw(`SELECT setval('hives_id_seq', 1)`),
          trx.raw(`SELECT setval('users_id_seq', 1)`)
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("users").insert(preppedUsers);
}

function seedHives(db, hives) {
  const preppedHives = hives.map(hive => ({
    ...hive
  }));
  return db.into("hives").insert(preppedHives);
}

function seedHivesUsersJoinTable(db, joins) {
  const joinedUsers = joins.map(join => ({
    ...join
  }));
  return db.into("hives_users").insert(joinedUsers);
}

function seedHivesTables(db, users, hives, activity = []) {
  //use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await seedHives(trx, hives);
    await trx.into("hives_users").insert(users[0].id, hives[0].id);

    if (activity.length) {
      await trx.into("hive_activity").insert(activity);
    }
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_email,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeHivesArray,
  makeHivesUsersArray,
  makeActivityArray,
  makeExpectedHive,
  makeUsersArray,
  cleanTables,
  seedUsers,
  seedHivesTables,
  seedHivesUsersJoinTable,
  makeExpectedJoinHive,
  makeAuthHeader
};
