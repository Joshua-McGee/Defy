const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    let templateVars = {
      API_KEY: process.env.API_KEY
    }
    res.render('my_challenges', templateVars);
  });

  router.get('/create', (req, res) => {
    res.render('create_challenges');
  });

  router.get('/:id', (req, res) => {

  });

  router.get('/genres/:genre', (req, res) => {

    let queryString = `
    SELECT *
    FROM challenges
    JOIN locations ON locations.id = location_id
    `;

    switch(req.params.genre) {
      case 'Physical':
        queryString += `
        WHERE genre = 'Physical'
        `;
        break;
      case 'Mental':
        queryString += `
        WHERE genre = 'Mental'
        `;
        break;
      case 'Game':
        queryString +=`
        WHERE genre = 'Game'
        `;
        break;
      case 'Random':
        queryString +=`
        WHERE genre NOT IN ('Physical', 'Mental', 'Game')
        `
        break;
      default:
        break;
    }

    db.query(queryString)
    .then(data =>{
      res.json({data})
    })
    .catch(err => console.log(err));
  });

  router.get('/locations', (req, res) => {

  });

  //gate
  router.post('/', (req, res) => {
    const { maxOccupancy, genre, challengeName, description, time, location, userId } = req.body.data;

    const queryString = `
      SELECT id
      FROM locations
      WHERE name = $1 AND lat = $2 AND long = $3 AND address = $4;
    `;

    db.query(queryString, [location.name, location.lat, location.lng, location.address])
    .then(data => {
      if(data.rows){
        return Promise.resolve(data.rows[0].id);
      }
      const queryLocation = `
        INSERT INTO locations (name, lat, long, address)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      return db.query(queryLocation, [location.name, location.lat, location.lng, location.address])
      .then(location => {
        return Promise.resolve(location.id);
      });
    })
    .then(locationId => {
      const queryChallenges =  `
        INSERT INTO challenges (user_id, location_id, genre, name, description, time, max_occupancy)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;

      db.query(queryChallenges, [userId, locationId, genre, challengeName, description, time, maxOccupancy])
      .then(challenges => {
        res.json({ successful: true });
      });
    })
    .catch(err => {
      res.json({successful: false});
    })
  });

  //gate
  router.put('/', (req, res) => {

  });

  //gate
  router.delete('/', (req, res) => {

  });

  return router;
}
