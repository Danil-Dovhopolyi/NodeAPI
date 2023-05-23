import UserModel from '../models/UserModel.js';
import RoleModel from '../models/RoleModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || '';
const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};
class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Registration error', errors });
      }
      const { email, password } = req.body;
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: 'User already exist' });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await RoleModel.findOne({ value: 'User' });
      const user = new UserModel({
        email,
        password: hashPassword,
        roles: [userRole === null || userRole === void 0 ? void 0 : userRole.value],
      });
      await user.save();
      res.json({ message: 'User was created' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error' });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: `User ${email} not found` });
      }
      const validPassword = user && bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Invalid password' });
      }
      const objectId = new ObjectId();
      const stringId = objectId.toHexString();
      const token = user && generateAccessToken(stringId, user.roles);
      res.json({ token: token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Login error' });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }
}
export default AuthController;
//# sourceMappingURL=AuthController.js.map
