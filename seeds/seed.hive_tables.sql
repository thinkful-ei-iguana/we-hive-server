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
    ('wendybee1', 'Wendy', 'web@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJpYXQiOjE1Nzc5OTU3NDgsInN1YiI6IndlYkB5YWhvby5jb20ifQ.Ml3XwdpvOPbeHZZlfezLcbhNPd7GKyB8kDTMJsC9N5k'),
    ('wendybee2', 'Wendy', 'web@hotmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJpYXQiOjE1Nzc5OTU3NDgsInN1YiI6IndlYkB5YWhvby5jb20ifQ.Ml3XwdpvOPbeHZZlfezLcbhNPd7GKyB8kDTMJsC9N5k'),
    ('wendybee3', 'Wendy', 'web@aol.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJpYXQiOjE1Nzc5OTU3NDgsInN1YiI6IndlYkB5YWhvby5jb20ifQ.Ml3XwdpvOPbeHZZlfezLcbhNPd7GKyB8kDTMJsC9N5k');

  INSERT INTO hive_goals
    (goal_type, goal_description, target_date, group_message, user_id)
  VALUES
    ('Event', 'Plan mom''s 75th bday', '2013-11-28 23:09:11.761166+03', 'celebrate!', 1),
    ('Stretch Goal', 'Run 100 miles in South Africa', '2013-11-28 23:09:11.761166+03', '', 2),
    ('Future Goal', 'Write a novel', '2013-11-28 23:09:11.761166+03', 'Let''s reach 50,000 words together', 3);

  INSERT INTO hive_groups
    (
    user_id
    )
  VALUES
    (1),
    (2),
    (3);

  INSERT INTO hive_activity
    (group_id, user_id, comment)
  VALUES
    (1, 1, 'Great job everyone!'),
    (1, 2, 'Keep it up'),
    (1, 3, 'Who wants to go for a run this weekend?');

  COMMIT;