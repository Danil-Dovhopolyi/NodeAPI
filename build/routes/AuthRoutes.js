import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { check } from 'express-validator/src/middlewares/validation-chain-builders.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
const AuthRoutes = express.Router();
const authController = new AuthController();
AuthRoutes.post('/login', authController.login);
AuthRoutes.post(
  '/register',
  [
    check('email', 'email cannot be empty').notEmpty(),
    check('password', 'Password must be between 4 and 10 characters').isLength({ min: 4, max: 10 }),
  ],
  authController.registration,
);
AuthRoutes.get('/users', AuthMiddleware, authController.getUsers);
export default AuthRoutes;
//# sourceMappingURL=AuthRoutes.js.map
