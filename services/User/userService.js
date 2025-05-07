const express = require('express');

const userRouter = express.Router();
const userController = require('../controllers/userCtrl');
const isAuth = require('../../middlewares/isAuth');

// register the user
userRouter.post('/api/v1/register', userController.register);

// login the user
userRouter.post('/api/v1/login', userController.login);

module.exports = userRouter;