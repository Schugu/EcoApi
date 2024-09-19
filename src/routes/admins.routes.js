import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { adminSchema, loginSchema } from "../schemas/admin.js";
import { workerSchema, updateWorkerSchema } from "../schemas/workers.js";
import { ProcessCtrSchema, updatedProcessCtrSchema } from "../schemas/ProcessCtr.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

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
  adminsRouter.get('/workers/:id', authRequire, validateParamsSchema(idSchemaUUID), adminController.getWorkerById);
  adminsRouter.patch('/workers/:id', authRequire, validateParamsSchema(idSchemaUUID), validateSchema(updateWorkerSchema), adminController.editWorkerById);
  adminsRouter.delete('/workers/:id', authRequire, validateParamsSchema(idSchemaUUID), adminController.deleteWorkerById);

  // Administrar processing centers
  adminsRouter.post('/processCtr', authRequire, validateSchema(ProcessCtrSchema), adminController.newProcessCtr);
  adminsRouter.get('/processCtr', authRequire, adminController.getAllProcessCtr);
  adminsRouter.get('/processCtr/:id', authRequire, validateParamsSchema(idSchemaUUID), adminController.getProcessCtrById);
  adminsRouter.patch('/processCtr/:id', authRequire, validateParamsSchema(idSchemaUUID), validateSchema(updatedProcessCtrSchema), adminController.editProcessCtrById);
  adminsRouter.delete('/processCtr/:id', authRequire, validateParamsSchema(idSchemaUUID), adminController.deleteProcessCtrById);


  // Administración de workers en process centers
  adminsRouter.post('/processCtr/:id/workers', authRequire, validateParamsSchema(idSchemaUUID), validateSchema(worker_idSchemaUUID), adminController.assignWorkerToCenter);
  adminsRouter.delete('/processCtr/:id/workers/:worker_id', authRequire, validateParamsSchema(idAndWorkerIdSchemaUUID), adminController.deleteWorkerToCenter);


  return adminsRouter;
}