const express = require('express');
const router = express.Router();
const { Vehicle, Coordinates } = require('../models')
const { Op } = require("sequelize");
const config = require('../config');

/* GET Vehicle listing. */
router.get('/', async (req, res, next) => {
  const limit = req.query.rowsPerPage || config.rowsPerPage
  const offset = (req.query.page - 1 || 0) * limit;
  let where = {};
  if (req.query.search) where[Op.or] = ['num'].map(key => ({ [key]: { [Op.like]: '%' + req.query.search + '%' } }));
  const response = await Vehicle.findAndCountAll({
    orderBy: [['updatedAt', 'DESC']],
    limit, offset, where
  });
  res.json({
    success: true,
    message: 'respond with a resource',
    data: response.rows,
    pages: Math.ceil(response.count / limit)
  });
});

/* POST create new Vehicle. */
router.post('/', async (req, res, next) => {
  let message = 'New vehicle registered';
  let vehicle;
  try {
    vehicle = await Vehicle.create({
      ...req.body
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.errors.pop().message
    });
  }
  res.json({
    success: true,
    message,
    data: vehicle
  });
});

/* PUT update existing Vehicle. */
router.put('/:id', async (req, res, next) => {
  let vehicle = await Vehicle.findOne({ where: { id: req.params.id } });
  if (!vehicle) return res.status(400).json({
    success: false,
    message: 'No vehicle found!'
  });
  vehicle.num = req.body.num;
  vehicle.notes = req.body.notes;
  try {
    const response = await vehicle.save();
    return res.json({
      success: true,
      message: 'vehicle updated',
      data: response
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.errors.pop().message
    });
  }
});

router.delete('/:id', async (req, res, next) => {
  let response = await Vehicle.destroy({ where: { id: req.params.id } });
  if (response) res.json({
    success: true,
    message: 'Vehicle deleted'
  });
  else res.status(400).json({
    success: false,
    message: 'No Vehicle found!'
  });
})

module.exports = router;
