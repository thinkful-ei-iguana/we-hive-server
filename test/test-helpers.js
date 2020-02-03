/* eslint-disable quotes */
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
      goal_description: "Goal 1 desc for type 3",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "Goal 1 group message",
      date_added: "2020-01-01T12:30:30.615Z"
    },
    {
      id: 2,
      goal_type: 2,
      goal_description: "Goal 2 desc for type 2",
      target_date: "2020-01-01T12:30:30.615Z",
      group_message: "Goal 2 group message",
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
}

function makeHivesUsersArray() {
  return [
    {
      id: 1,
      hive_id: 1,
      user_id: 1
    },
    {
      id: 2,
      hive_id: 1,
      user_id: 2
    },
    {
      id: 3,
      hive_id: 3,
      user_id: 1
    },
    {
      id: 4,
      hive_id: 2,
      user_id: 2
    },
    {
      id: 5,
      hive_id: 2,
      user_id: 2,
      code: "testpass"
    }
  ];
}

function makeActivityArray() {
  return [
    {
      id: 1,
      action: "action for hive 1",
      notes: "comment for hive 1",
      date_added: "2020-01-01T12:30:30.615Z",
      hive_id: 1,
      user_id: 1
    },
    {
      id: 2,
      action: "another action for hive 1",
      notes: "another comment for hive 1",
      date_added: "2020-01-01T12:30:30.615Z",
      hive_id: 1,
      user_id: 2
    },
    {
      id: 3,
      action: "third action for hive 1",
      notes: "third comment for hive 1",
      date_added: "2020-01-01T12:30:30.615Z",
      hive_id: 1,
      user_id: 3
    },
    {
      id: 4,
      action: "first action for hive 2",
      notes: "first comment for hive 2",
      date_added: "2020-01-01T12:30:30.615Z",
      hive_id: 2,
      user_id: 1
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
    id: 1,
    hive_id: hive.id,
    user_id: user.id
  };
}

function makeExpectedActivity(users, hivesUser, activity = []) {
  const user = users.find(user => user.id === hivesUser.user_id);
  const activityList = activity.filter(
    act => act.hive_id === hivesUser.hive_id
  );

  return {
    id: activity.id,
    action: activity.action,
    notes: activity.notes,
    date_added: activity.date_added,
    hive_id: activity.hive_id,
    user_id: activity.user_id,
    user: user.first_name
  };
}

function makeHivesFixtures() {
  const testUsers = makeUsersArray();
  const testHives = makeHivesArray();
  const testJoinHives = makeHivesUsersArray();
  const testActivity = makeActivityArray();
  return { testUsers, testHives, testJoinHives, testActivity };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE hive_activity, hives_users, hives, users RESTART IDENTITY CASCADE`
    )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));

  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedHives(db, hives) {
  return db
    .into("hives")
    .insert(hives)
    .then(() =>
      db.raw(`SELECT setval('hives_id_seq', ?)`, [hives[hives.length - 1].id])
    );
}

function seedHivesUsers(db, hives_users) {
  return db
    .into("hives_users")
    .insert(hives_users)
    .then(() =>
      db.raw(`SELECT setval('hives_users_id_seq', ?)`, [
        hives_users[hives_users.length - 1].id
      ])
    );
}
function seedHivesTables(db, users, hives, hives_users, activity = []) {
  //use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    seedUsers(trx, users);
    seedHives(trx, hives);
    seedHivesUsers(trx, hives_users);

    trx.raw(`SELECT setval('hives_users_id_seq', ?)`, [
      hives_users[hives_users.length - 1].id
    ]);

    if (activity.length) {
      await trx.into("hive_activity").insert(activity);
      await trx.raw(`SELECT setval('hive_activity_id_seq', ?)`, [
        activity[activity.length - 1].id
      ]);
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

function makeHashPassword(password) {
  return bcrypt.hash(password, 12);
}

module.exports = {
  makeUsersArray,
  makeHivesArray,
  makeHivesUsersArray,
  makeActivityArray,
  makeExpectedHive,
  makeExpectedJoinHive,
  makeExpectedActivity,
  makeHivesFixtures,
  cleanTables,
  seedUsers,
  seedHives,
  seedHivesTables,
  seedHivesUsers,
  makeAuthHeader,
  makeHashPassword
};
