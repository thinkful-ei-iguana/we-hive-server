CREATE TABLE hives
(
  id SERIAL PRIMARY KEY,
  goal_type INTEGER NOT NULL,
  goal_description TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  group_message TEXT,
  date_added TIMESTAMPTZ NOT NULL DEFAULT now
()
);