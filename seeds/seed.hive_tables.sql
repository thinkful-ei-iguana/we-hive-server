BEGIN;

  TRUNCATE
  hive_activity,
  hives_users,
  hives,
  users
  RESTART IDENTITY CASCADE;

  INSERT INTO users
    (user_name, first_name, user_email, password)
  VALUES
    ('wendybee1', 'Wendy', 'web@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.'),
    ('IAmADemo', 'Demo', 'demo@me.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.'),
    ('AmyAmie', 'Amy', 'amy@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.'),
    ('Raf', 'Rafe', 'rafe@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.');

  INSERT INTO hives
    (goal_type, goal_description, target_date, group_message)
  VALUES
    (1, 'Plan trip to Scotland', '2020-11-28 23:09:11.761166+03', 'Let''s go in the summer for the Scottish Games!!!'),
    (2, 'Run a marathon', '2020-07-28 23:09:11.761166+03', ''),
    (3, 'Run 100 miles in South Africa', '2021-11-28 23:09:11.761166+03', ''),
    (4, 'Write a novel', '2020-11-30 23:09:11.761166+03', 'Let''s reach 50,000 words together for NaNoWrimo');

  INSERT INTO hives_users
    (
    hive_id, user_id
    )
  VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (3, 1),
    (3, 4),
    (4, 1),
    (4, 2);

  INSERT INTO hive_activity
    (action, notes, hive_id, user_id)
  VALUES
    ('Went for a run!', 'rolling out helped my knee', 2, 4),
    ('Wrote an outline', 'found a writing group to meet with on Sundays', 3, 1),
    ('Researched local upcoming marathons', '', 2, 4);

  COMMIT;