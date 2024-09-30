import { Router } from 'express';

import { AuthController } from "../controllers/auth.controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";

import { loginSchema } from "../schemas/auth.js";

import { authRequire } from "../middlewares/validateToken.js";

export const createAuthRouter = ({ adminModel, workerModel }) => {
  const authRouter = Router();

  const authController = new AuthController({ adminModel, workerModel });

  authRouter.post('/login', validateSchema(loginSchema), authController.login);
  authRouter.get('/protected', authRequire(['admin', 'workerAsigned']), authController.protected);
  authRouter.post('/logout', authRequire(['admin', 'workerAsigned']), authController.logout);

  return authRouter;
}