import { Request, Response } from 'express';
import UserModel from '../models/UserModel.js';
import RoleModel from '../models/RoleModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { IAuthController } from '../types/IAuthController.js';
import { ObjectId } from 'mongodb';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || '';
const generateAccessToken = (id: string, roles: string[]) => {
  const payload = { id, roles };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};
class AuthController implements IAuthController {
  async registration(req: Request, res: Response): Promise<void> {
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
      const user = new UserModel({ email, password: hashPassword, roles: [userRole?.value] });
      await user.save();
      res.json({ message: 'User was created' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error' });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
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
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }
}

export default AuthController;
