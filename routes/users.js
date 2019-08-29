/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/",async (req, res) => {
    // make a query that combines users, challenges, user_challenges.
    // we want it to have users.name, users.email, list of challenges to be completed + are completed, avatar url
    let queryString = `
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
    `
    let data = await db.query(queryString);

    let templateVar = {
      data: data.rows
    }

    res.render('profile', templateVar);
  });

  router.get('/:id',async (req, res) => {

    let id = req.params.id;

    let userQuery = `
      SELECT
      users.name as username,
      users.email,
      users.avatar_url,
        (SELECT COUNT(*) + 1
         FROM users as competitors
         WHERE competitors.challenges_completed >= users.challenges_completed AND competitors.challenges_completed <> users.challenges_completed
         AND users.id = $1) as rank
      FROM users
      WHERE users.id = $1;
    `

    let user = await db.query(userQuery, [id]);

    let createdChallengesQuery = `
    SELECT
    challenges.id,
    challenges.description,
    TO_CHAR(challenges.date::DATE,'dd/mm/yyyy') as date,
    challenges.name,
    challenges.genre
    FROM challenges
    WHERE user_id = $1;
    `;
    let created = await db.query(createdChallengesQuery, [id]);

    let acceptedChallengesQuery = `
    SELECT
    challenges.id,
    user_challenges.completed,
    challenges.description,
    TO_CHAR(challenges.date::DATE,'dd/mm/yyyy') as date,
    challenges.name,
    challenges.genre
    FROM challenges
    JOIN user_challenges ON challenges.id = challenge_id
    WHERE user_challenges.user_id = $1
    ORDER BY user_challenges.completed;
    `;

    let accepted = await db.query(acceptedChallengesQuery, [id]);

    let templateVar = {
      data: {
        user: user.rows[0],
        created: created.rows,
        accepted: accepted.rows
      }
    }
    //console.log(templateVar);
    res.render('profile', templateVar);
  });

  router.post('/login', (req, res) => {
    const { email } = req.body;
    let queryString = `
      SELECT *
      FROM users
      WHERE email = $1;
    `
    db.query(queryString, [email])
    .then(users => {
      if (!users.rows) {
        res.send({ error: "error" });
        return;
      }
      let user = users.rows[0];
      req.session.userId = user.id;
      res.json({user: {name: user.name, email: user.email, id: user.id }})
    })
    .catch(err => {
      return res.json({err});
    })
  });

  router.delete('/', (req, res) => {
    let {id, challenge_id} = req.body;

    console.log(id, challenge_id);

    let deleteChallenges = `
      DELETE FROM user_challenges
      WHERE challenge_id = $1 AND user_id = $2;
    `

    db.query(deleteChallenges, [challenge_id, id])
    .then(() => {
      return res.json({successful: true});
    })
    .catch(err => console.log(err));
  });

  return router;
};
