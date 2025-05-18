const express = require('express');
const healthRouter = express.Router();
const isAuth = require('../../middlewares/isAuth');
const healthRecordController = require('../../controllers/healthRecordCtrl');

// Log a new health record for a pet
healthRouter.post(
  '/api/v1/pet/:petId/health-records',
  isAuth,
  healthRecordController.createHealthRecord
);

// Get all health records for a pet
healthRouter.get(
  '/api/v1/pet/:petId/health-records',
  isAuth,
  healthRecordController.getHealthRecordByPet
);

// Get a single health record by its ID
healthRouter.get(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthRecordController.getHealthRecordById
);

// Update a health record
healthRouter.put(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthRecordController.updateHealthRecord
);

// Delete a health record
healthRouter.delete(
  '/api/v1/health-records/:healthRecordId',
  isAuth,
  healthRecordController.deleteHealthRecord
);

healthRouter.get(
  "/api/v1/health-records",
  isAuth,
  healthRecordController.getHealthRecordByUser
)
module.exports = healthRouter;
