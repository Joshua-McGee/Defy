const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    let templateVars = {
      API_KEY: process.env.API_KEY
    }
    res.render('my_challenges', templateVars);
  });

  router.get('/list', (req, res) => {
    let list = {
      'coquitlam': {
        lat: 49.2838,
        lng: -122.7932,
        name: 'Marathon',
        address: '999 Ave',
        date: '27 Aug',
        description: 'Run really fast',
        genre: 'Physical'
      },
      'kitsilano': {
        lat: 49.2684,
        lng: -123.1683,
        name: 'Eating Contest',
        address: '999 Ave',
        date: '27 Aug',
        description: 'Eat really fast',
        genre: 'Food'
      }
    };

    const queryString = `
    SELECT *
    FROM challenges
    JOIN locations ON locations.id = location_id;
    `;

    db.query(queryString)
    .then(data =>{
      res.json({data})
    })
    .catch(err => console.log(err));
  });

  router.get('/create', (req, res) => {
    res.render('create_challenges');
  });

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
