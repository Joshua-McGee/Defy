DROP TABLE IF EXISTS user_challenges CASCADE;
CREATE TABLE user_challenges (
  id SERIAL PRIMARY KEY NOT NULL,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);
