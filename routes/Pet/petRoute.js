const express = require('express');
const petRouter = express.Router();
const isAuth = require('../../middlewares/isAuth');
const petController = require('../../controllers/petCtrl');
const multer = require('multer');
const { storage } = require('../../utils/cloudinary');
const upload = multer({ storage });

// create a pet
petRouter.post('/api/v1/pet', isAuth, upload.single("image"), petController.createPet);
// get pets by user
petRouter.get('/api/v1/pets', isAuth, petController.getPetByUser);
// get pet by id
petRouter.get('/api/v1/pet/:petId', isAuth, petController.getPetById);

// update pet by id
petRouter.put('/api/v1/pet/:petId', isAuth, petController.updatePet);
// delete pet by id
petRouter.delete('/api/v1/pet/:petId', isAuth, petController.deletePet);

module.exports = petRouter;