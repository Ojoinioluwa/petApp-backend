const express = require('express');
const petRouter = express.Router();
const isAuth = require('../../middlewares/isAuth');
const petController = require('../../controllers/petCtrl');

petRouter.post('/api/v1/pet', isAuth, petController.createPet);
petRouter.get('/api/v1/pet', isAuth, petController.getPetByUser);
petRouter.get('/api/v1/pet/:petId', isAuth, petController.getPetById);
petRouter.put('/api/v1/pet/:petId', isAuth, petController.updatePet);
petRouter.delete('/api/v1/pet/:petId', isAuth, petController.deletePet);

module.exports = petRouter;