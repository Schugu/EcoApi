import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { workerSchema, loginSchema } from "../schemas/workers.js";

import { WorkerController } from "../controllers/workers.controller.js";

import { authRequire } from "../middlewares/validateToken.js";

export const createWorkerRouter = ({ workerModel }) => {
  const workersRouter = Router();

  const workerController = new WorkerController({ workerModel });

  workersRouter.post('/register', validateSchema(workerSchema), workerController.register);

  workersRouter.post('/login', validateSchema(loginSchema), workerController.login);

  workersRouter.get('/protected', workerController.protected);

  workersRouter.post('/logout', workerController.logout);

  return workersRouter;
}