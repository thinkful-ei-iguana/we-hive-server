CREATE TABLE hive_users
(
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

