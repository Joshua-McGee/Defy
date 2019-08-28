const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    let templateVars = {
      API_KEY: process.env.API_KEY
    }
    res.render('create_challenge', templateVars);
  });

  router.get('/create', (req, res) => {

   // res.render('create_challenges');
  })

  router.get('/:id', (req, res) => {

  });

  router.get('/genres/:genre', (req, res) => {

  });

  router.get('/locations', (req, res) => {

  });

  //gate
  router.post('/', (req, res) => {

  });

  //gate
  router.put('/', (req, res) => {

  });

  //gate
  router.delete('/', (req, res) => {

  });

  return router;
}
