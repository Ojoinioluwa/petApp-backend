const express = require('express');
const petRouter = express.Router();
const petController = require('../controllers/petCtrl');
const isAuth = require('../../middlewares/isAuth');

petRouter.post('/api/v1/pet', isAuth, petController.createPet);
petRouter.get('/api/v1/pet', isAuth, petController.getPetByUser);
petRouter.get('/api/v1/pet/:petId', isAuth, petController.getPetById);
petRouter.put('/api/v1/pet/:petId', isAuth, petController.updatePet);
petRouter.delete('/api/v1/pet/:petId', isAuth, petController.deletePet);

module.exports = petRouter;