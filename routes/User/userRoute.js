const express = require('express');

const userRouter = express.Router();
const isAuth = require('../../middlewares/isAuth');
const userController = require('../../controllers/userCtrl');

// register the user
userRouter.post('/api/v1/register', userController.register);

// login the user
userRouter.post('/api/v1/login', userController.login);

// get user profile
userRouter.get("/api/v1/getProfile", userController.getProfile);

// update profile

module.exports = userRouter;