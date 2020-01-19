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
    ('jujubee2', 'Julia', 'jbb@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.'),
    ('abee3', 'Alex', 'ajb@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.'),
    ('wraif', 'Rafe', 'rafe@gmail.com', '$2a$12$8zTUtyLYgtn4hjqnKZ.isepUhdgxYhRRBGANpeTsEJLPTZFNLIw1.');

  INSERT INTO hives
    (goal_type, goal_description, target_date, group_message)
  VALUES
    (1, 'Plan trip to Scotland', '2020-11-28 23:09:11.761166+03', 'Anyone up for the Scottish Games?'),
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
    (2, 1),
    (4, 1),
    (4, 2),
    (3, 1);

  INSERT INTO hive_activity
    (action, timer, rating, notes, reminders, hive_id, user_id)
  VALUES
    ('Went for a run!', '1:30:00', 5, 'rolling out helped my knee', 'buy new shoes', 2, 4),
    ('Wrote an outline', '0:30:00', 5, 'found a writing group to meet with on Sundays', 'Write without distraction', 3, 1),
    ('Researched local upcoming marathons', '0:30:00', 5, '', 'Sign up by Friday', 2, 4);

  COMMIT;