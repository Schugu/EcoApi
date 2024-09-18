import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { adminSchema, loginSchema } from "../schemas/admin.js";
import { workerSchema, updateWorkerSchema } from "../schemas/workers.js";
import { ProcessCtrSchema, updatedProcessCtrSchema } from "../schemas/ProcessCtr.js";

import { AdminController } from "../controllers/admins.controller.js";

import { authRequire } from "../middlewares/validateToken.js";

export const createAdminRouter = ({ adminModel }) => {
  const adminsRouter = Router();

  const adminController = new AdminController({ adminModel });

  // Autentificación
  adminsRouter.post('/register', validateSchema(adminSchema), adminController.register);
  adminsRouter.post('/login', validateSchema(loginSchema), adminController.login);
  adminsRouter.get('/protected', authRequire, adminController.protected);
  adminsRouter.post('/logout', authRequire, adminController.logout);

  // Administrar Workers
  adminsRouter.post('/workers', authRequire, validateSchema(workerSchema), adminController.newWorker);
  adminsRouter.get('/workers', authRequire, adminController.getAllWorkers);
  adminsRouter.get('/workers/:id', authRequire, adminController.getWorkerById);
  adminsRouter.patch('/workers/:id', authRequire, validateSchema(updateWorkerSchema), adminController.editWorkerById);
  adminsRouter.delete('/workers/:id', authRequire, adminController.deleteWorkerById);

  // Administrar processing centers
  adminsRouter.post('/processCtr', authRequire, validateSchema(ProcessCtrSchema), adminController.newProcessCtr);
  adminsRouter.get('/processCtr', authRequire, adminController.getAllProcessCtr);
  adminsRouter.get('/processCtr/:id', authRequire, adminController.getProcessCtrById);
  adminsRouter.patch('/processCtr/:id', authRequire, validateSchema(updatedProcessCtrSchema), adminController.editProcessCtrById);
  adminsRouter.delete('/processCtr/:id', authRequire, adminController.deleteProcessCtrById);

  return adminsRouter;
}