const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("landing");
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
