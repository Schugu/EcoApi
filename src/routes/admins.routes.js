import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { adminSchema, loginSchema } from "../schemas/admin.js";
import { workerSchema, updateWorkerSchema } from "../schemas/workers.js";

import { AdminController } from "../controllers/admins.controller.js";

import { authRequire } from "../middlewares/validateToken.js";

export const createAdminRouter = ({ adminModel }) => {
  const adminsRouter = Router();

  const adminController = new AdminController({ adminModel });

  adminsRouter.post('/register', validateSchema(adminSchema), adminController.register);

  adminsRouter.post('/login', validateSchema(loginSchema), adminController.login);

  adminsRouter.get('/protected', authRequire, adminController.protected);

  adminsRouter.post('/logout', authRequire, adminController.logout);

  // Administrar Workers
  adminsRouter.get('/workers', authRequire, adminController.getAllWorkers);
  adminsRouter.get('/workers/:id', authRequire, adminController.getWorkerById);

  adminsRouter.post('/workers', authRequire, validateSchema(workerSchema), adminController.newWorker);

  adminsRouter.patch('/workers/:id', authRequire, validateSchema(updateWorkerSchema), adminController.editWorkerById);

  adminsRouter.delete('/workers/:id', authRequire, adminController.deleteWorkerById);

  return adminsRouter;
}