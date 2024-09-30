import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { ProcessCtrSchema, updatedProcessCtrSchema } from "../schemas/ProcessCtr.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

import { ProcessCtrController } from "../controllers/processCtr.controller.js";

export const createProcessCtrRouter = ({ processCtrModel }) => {
  const processCtrRouter = Router();

  const processCtrController = new ProcessCtrController({ processCtrModel });

  // Administrar processing centers
  processCtrRouter.post('/', validateSchema(ProcessCtrSchema), processCtrController.newProcessCtr);
  processCtrRouter.get('/', processCtrController.getAllProcessCtr);
  processCtrRouter.get('/:id', validateParamsSchema(idSchemaUUID), processCtrController.getProcessCtrById);
  processCtrRouter.patch('/:id', validateParamsSchema(idSchemaUUID), validateSchema(updatedProcessCtrSchema), processCtrController.editProcessCtrById);
  processCtrRouter.delete('/:id', validateParamsSchema(idSchemaUUID), processCtrController.deleteProcessCtrById);

  // Administración de workers en process centers
  processCtrRouter.post('/:id/workers', validateParamsSchema(idSchemaUUID), validateSchema(worker_idSchemaUUID), processCtrController.assignWorkerToCenter);
  processCtrRouter.get('/:id/workers', validateParamsSchema(idSchemaUUID), processCtrController.getAllWorkersOnProcessCtr);
  processCtrRouter.get('/workers/assignments', processCtrController.getAllWorkersAssignments);
  processCtrRouter.delete('/:id/workers/:worker_id', validateParamsSchema(idAndWorkerIdSchemaUUID), processCtrController.deleteWorkerToCenter);

  return processCtrRouter;
}