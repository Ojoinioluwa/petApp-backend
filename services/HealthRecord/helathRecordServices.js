const express = require('express');
const healthRouter = express.Router();
const healthCtrl  = require('../controllers/healthRecordCtrl');
const isAuth      = require('../../middlewares/isAuth');

// Log a new health record for a pet
healthRouter.post(
  '/api/v1/pet/:petId/health-records',
  isAuth,
  healthCtrl.createHealthRecord
);

// Get all health records for a pet
healthRouter.get(
  '/api/v1/pet/:petId/health-records',
  isAuth,
  healthCtrl.getHealthRecordByPet
);

// Get a single health record by its ID
healthRouter.get(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthCtrl.getHealthRecordById
);

// Update a health record
healthRouter.put(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthCtrl.updateHealthRecord
);

// Delete a health record
healthRouter.delete(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthCtrl.deleteHealthRecord
);

module.exports = healthRouter;
