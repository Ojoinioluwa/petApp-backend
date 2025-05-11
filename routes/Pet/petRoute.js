const express = require('express');
const petRouter = express.Router();
const isAuth = require('../../middlewares/isAuth');
const petController = require('../../controllers/petCtrl');

// create a pet
petRouter.post('/api/v1/pet', isAuth, petController.createPet);
// get pet by user
petRouter.get('/api/v1/pet', isAuth, petController.getPetByUser);
// get pet by id
petRouter.get('/api/v1/pet/:petId', isAuth, petController.getPetById);

// update pet by id
petRouter.put('/api/v1/pet/:petId', isAuth, petController.updatePet);
// delete pet by id
petRouter.delete('/api/v1/pet/:petId', isAuth, petController.deletePet);

module.exports = petRouter;