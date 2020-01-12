CREATE TABLE hives_users
(
  hive_id INTEGER REFERENCES hives(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code TEXT UNIQUE,
  PRIMARY KEY (hive_id, user_id)
)