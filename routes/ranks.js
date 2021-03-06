const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get('/',async (req, res) => {

    const queryString = `
    SELECT
      users.id,
      users.name,
      users.challenges_completed as Total,
      ( SELECT COUNT(*)
        FROM users as physical_users
        JOIN challenges ON physical_users.id = challenges.user_id
        WHERE physical_users.id = users.id AND challenges.genre = 'Physical'
      ) as Physical,
      ( SELECT COUNT(*)
        FROM users as mental_users
        JOIN challenges ON mental_users.id = challenges.user_id
        WHERE mental_users.id = users.id AND challenges.genre = 'Mental'
      ) as Mental,
      ( SELECT COUNT(*)
        FROM users as game_users
        JOIN challenges ON game_users.id = challenges.user_id
        WHERE game_users.id = users.id AND challenges.genre = 'Game'
      ) as Game,
      ( SELECT COUNT(*)
        FROM users as random_users
        JOIN challenges ON random_users.id = challenges.user_id
        WHERE random_users.id = users.id AND challenges.genre = 'Random'
      ) as Random,
      (SELECT COUNT(*) + 1
         FROM users as competitors
         WHERE competitors.challenges_completed >= users.challenges_completed AND competitors.challenges_completed <> users.challenges_completed
         ) as Rank
      FROM users
      GROUP BY users.id, users.name, users.challenges_completed
      ORDER BY users.challenges_completed DESC, users.name
      LIMIT 10;
    `;

    let data = await db.query(queryString)

    let templateVars = {
      data: data.rows
    }

    res.render('ranks', templateVars);

  });

  return router;
};
