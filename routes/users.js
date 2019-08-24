/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.send('profile');
  });

  router.get('/:id/challenges', (req, res) => {

  });

  router.get('/:id', (req, res) => {

  });

  router.post('/login', (req, res) => {

  });

  router.put('/:id/challenges/:challenge_id', (req, res) => {

  });

  router.put('/:id', (req, res) => {

  });

  router.delete('/:id/challenges/:challenge_id', (req, res) => {

  });

  return router;
};
