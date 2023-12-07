import { Router } from 'express';
import RegisterController from '../controllers/RegisterController.js';
import LoginController from '../controllers/LoginController.js';

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.router.post('/register', RegisterController.userRegister);
    this.router.post('/login', LoginController.login);
  }
}

export default new AuthRoutes().router;