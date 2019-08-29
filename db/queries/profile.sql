SELECT
  users.name,
  users.email,
  users.avatar_url,
  users.challenges_completed,
  user_challenges.completed,
  challenges.description,
  challenges.date,
  challenges.name,
  challenges.genre
FROM users
JOIN user_challenges ON users.id = user_challenges.user_id
JOIN challenges ON challenges.id = user_challenges.challenge_id;
