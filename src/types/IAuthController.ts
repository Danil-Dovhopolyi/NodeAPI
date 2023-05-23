import { Request, Response } from 'express';
export interface IAuthController {
  registration(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
}
