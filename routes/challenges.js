const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {
  router.get('/', (req, res) => {
    let templateVars = {
      API_KEY: process.env.API_KEY
    }
    res.render('my_challenges', templateVars);
  });

  router.get('/create', (req, res) => {
    let templateVars = {
      API_KEY: process.env.API_KEY
    }
    res.render('create_challenge', templateVars);
  });

  router.get('/:id', (req, res) => {

  });

  router.get('/genres/:genre', (req, res) => {

    let queryString = `
    SELECT  challenges.id,
    user_id,
    location_id,
    genre,
    challenges.name as challenge_name,
    description,
    date,
    max_occupancy,
    locations.name as location_name,
    lat,
    long,
    zoom,
    address
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
  router.post('/', async (req, res) => {
    let { maxOccupancy, genre, challengeName, description, time, location, userId } = req.body.data;

    console.log('genre', genre);
    console.log('challenge Name', challengeName);
    time = moment(time).format();

    const queryString = `
      SELECT id
      FROM locations
      WHERE name = $1 AND lat = $2 AND long = $3 AND address = $4;
    `;

    db.query(queryString, [location.name, location.lat, location.lng, location.address])
    .then(data => {
      if(data.rows.length > 0){
        return Promise.resolve(data.rows[0].id);
      }
      const queryLocation = `
        INSERT INTO locations (name, lat, long, address)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      return db.query(queryLocation, [location.name, location.lat, location.lng, location.address])
      .then(location => {
        console.log("inside location", location.rows[0].id);
        return Promise.resolve(location.rows[0].id);
      })
      .catch(err=>console.log(err));
    })
    .then(locationId => {
      console.log("location");
      const queryChallenges = `
        INSERT INTO challenges (user_id, location_id, genre, name, description, date, max_occupancy)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;

      db.query(queryChallenges, [userId, locationId, genre, challengeName, description, time, maxOccupancy])
      .then(() => {
        res.json({successful: true});
      })
    })
    .catch(err => {
      res.json({successful: false});
    })
  });

  //gate
  router.delete('/', (req, res) => {
    //add function to remove only if id is same
    let {id, challenge_id} = req.body;

    let deleteChallenges = `
      DELETE FROM challenges
      WHERE id = $1 AND user_id = $2;
    `

    db.query(deleteChallenges, [challenge_id, id])
    .then(() => {
      return res.json({successful: true});
    })
    .catch(err => console.log(err));
  });

  return router;
}
