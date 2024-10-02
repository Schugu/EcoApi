import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { GreenPointSchema, updatedGreenPointSchema } from "../schemas/greenPoint.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

import { GreenPointController } from "../controllers/greenPoint.controller.js";

export const createGreenPointRouter = ({ greenPointModel }) => {
  const greenPointRouter = Router();

  const greenPointController = new GreenPointController({ greenPointModel });

  // Administrar processing centers
  greenPointRouter.post('/', validateSchema(GreenPointSchema), greenPointController.new);
  greenPointRouter.get('/', greenPointController.getAll);
  greenPointRouter.get('/:id', validateParamsSchema(idSchemaUUID), greenPointController.getProcessCtrById);
  greenPointRouter.patch('/:id', validateParamsSchema(idSchemaUUID), validateSchema(updatedGreenPointSchema), greenPointController.editProcessCtrById);
  greenPointRouter.delete('/:id', validateParamsSchema(idSchemaUUID), greenPointController.deleteProcessCtrById);

  // Administración de workers en process centers
  greenPointRouter.post('/:id/workers', validateParamsSchema(idSchemaUUID), validateSchema(worker_idSchemaUUID), greenPointController.assignWorkerToCenter);
  greenPointRouter.get('/:id/workers', validateParamsSchema(idSchemaUUID), greenPointController.getAllWorkersOnProcessCtr);
  greenPointRouter.get('/workers/assignments', greenPointController.getAllWorkersAssignments);
  greenPointRouter.delete('/:id/workers/:worker_id', validateParamsSchema(idAndWorkerIdSchemaUUID), greenPointController.deleteWorkerToCenter);

  return greenPointRouter;
}