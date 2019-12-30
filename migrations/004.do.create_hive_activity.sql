CREATE TABLE hive_activity
(
  id SERIAL PRIMARY KEY,
  action TEXT,
  comment TEXT,
  milestone TEXT,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  group_id INTEGER REFERENCES hive_groups(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES hive_users(id) ON DELETE CASCADE NOT NULL
)