const express = require('express');
const router = express.Router();
const { Vehicle, Coordinates } = require('../models')
const { Op } = require("sequelize");
const config = require('../config');

/* GET coordinates listing by vehicle. */
router.get('/', async (req, res, next) => {
  const limit = req.query.rowsPerPage || config.rowsPerPage
  const offset = (req.query.page - 1 || 0) * limit;
  let where = {};
    if (req.query.vehicleId) where['vehicleId'] =  req.query.vehicleId
    if (req.query.start_date) {
      where['createdAt'] = { [Op.between]: [req.query.start_date, req.query.end_date]}
    }
    
    const response = await Coordinates.findAndCountAll({
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

/* POST create new coordinates. */
router.post('/', async (req, res, next) => {
  let message = 'New Coordinates received';
  let coordinates;
  try {
    coordinates = await Coordinates.create({
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
    data: coordinates
  });
});

module.exports = router;
