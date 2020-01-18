CREATE TABLE hive_activity
(
  id SERIAL PRIMARY KEY,
  action TEXT,
  timer TIME(0),
  rating INTEGER,
  private BOOLEAN DEFAULT false,
  notes TEXT,
  reminders TEXT,
  date_added TIMESTAMPTZ NOT NULL DEFAULT now(),
  hive_id INTEGER REFERENCES hives(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
