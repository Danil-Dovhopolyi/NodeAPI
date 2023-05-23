import express, { Router, RequestHandler } from 'express';
import AuthController from '../controllers/AuthController.js';
import { IAuthController } from '../types/IAuthController.js';
import { check } from 'express-validator/src/middlewares/validation-chain-builders.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const AuthRoutes: Router = express.Router();
const authController: IAuthController = new AuthController();

AuthRoutes.post('/login', authController.login);
AuthRoutes.post(
  '/register',
  [
    check('email', 'Email cannot be empty').notEmpty(),
    check('password', 'Password must be between 4 and 10 characters').isLength({ min: 4, max: 10 }),
  ],
  authController.registration,
);

AuthRoutes.get('/users', AuthMiddleware as RequestHandler, authController.getUsers); // Type assertion added here

export default AuthRoutes;
