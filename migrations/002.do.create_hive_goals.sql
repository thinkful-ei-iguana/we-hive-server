DROP TYPE IF EXISTS goal;
CREATE TYPE goal AS ENUM
(
  'Event', 'Current Goal', 'Stretch Goal', 'Future Goal', 'Dream Goal', 'Completed Goal'
  );

CREATE TABLE hive_goals
(
  id SERIAL PRIMARY KEY,
  private BOOLEAN DEFAULT true,
  goal_type goal NOT NULL,
  goal_description TEXT NOT NULL,
  target_date DATE NOT NULL,
  group_message TEXT,
  date_added TIMESTAMPTZ NOT NULL DEFAULT now
() NOT NULL,
  user_id INTEGER REFERENCES hive_users(id) ON DELETE CASCADE
);