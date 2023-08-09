const express = require('express');
const { MongoDAL, PostgresDAL } = require('./dal');

const router = express.Router();
const mongoDAL = new MongoDAL();
const postgresDAL = new PostgresDAL();

router.get('/search', async (req, res) => {
  const selectedDatabase = req.query.database;
  const query = req.query.q || '';

  let searchResults;
  if (selectedDatabase === 'mongodb') {
    searchResults = await mongoDAL.searchEquipment(query);
  } else if (selectedDatabase === 'postgres') {
    searchResults = await postgresDAL.searchEquipment(query);
  }

  res.json(searchResults);
});

router.get('/rent/:id', async (req, res) => {
  const selectedDatabase = req.query.database;
  const equipmentId = req.params.id;

  let rentedEquipment;
  if (selectedDatabase === 'mongodb') {
    rentedEquipment = await mongoDAL.rentEquipment(equipmentId);
  } else if (selectedDatabase === 'postgres') {
    rentedEquipment = await postgresDAL.rentEquipment(equipmentId);
  }

  if (rentedEquipment) {
    res.render('rent', { equipment: rentedEquipment });
  } else {
    res.status(404).send('Equipment not found');
  }
});

module.exports = router;
