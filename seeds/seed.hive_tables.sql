BEGIN;

  TRUNCATE
  hive_activity,
  hive_groups,
  hive_goals,
  hive_users
  RESTART IDENTITY CASCADE;

  INSERT INTO hive_users
    (user_name, first_name, user_email, password)
  VALUES
    ('wendyB', 'Wendy', 'web@hotmail.com', '$2a$12$prjNPnpkptTWSltPxShtgO6L2W9uWpoaB1lqp/1e/EUEap43rWkUa'),
    ('misterE', 'Ernie', 'ernie@hotmail.com', '$2a$12$prjNPnpkptTWSltPxShtgO6L2W9uWpoaB1lqp/1e/EUEap43rWkUa'),
    ('stacieC', 'Stacy', 'stacee@hotmail.com', '$2a$12$prjNPnpkptTWSltPxShtgO6L2W9uWpoaB1lqp/1e/EUEap43rWkUa');

  INSERT INTO hive_goals
    (goal_type, goal_description, target_date, group_message, user_id)
  VALUES
    ('Event', 'Plan mom''s 75th bday', '2013-11-28 23:09:11.761166+03', 'celebrate!', 1),
    ('Stretch Goal', 'Run 100 miles in South Africa', '2013-11-28 23:09:11.761166+03', '', 1),
    ('Stretch Goal', 'Write a novel', '2013-11-28 23:09:11.761166+03', 'Let''s reach 50,000 words together', 1);

  INSERT INTO hive_groups
    (
    user_id
    )
  VALUES
    (1),
    (1),
    (1);

  INSERT INTO hive_activity
    (group_id, user_id, comment)
  VALUES
    (1, 1, 'Great job everyone!'),
    (1, 1, 'Keep it up');

  COMMIT;