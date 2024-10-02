import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { GreenPointSchema, updatedGreenPointSchema } from "../schemas/greenPoint.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

import { GreenPointController } from "../controllers/greenPoint.controller.js";

export const createGreenPointRouter = ({ greenPointModel }) => {
  const greenPointRouter = Router();

  const greenPointController = new GreenPointController({ greenPointModel });

  // Administrar green points
  greenPointRouter.post('/', validateSchema(GreenPointSchema), greenPointController.new);
  greenPointRouter.get('/', greenPointController.getAll);
  greenPointRouter.get('/:id', validateParamsSchema(idSchemaUUID), greenPointController.getById);
  greenPointRouter.patch('/:id', validateParamsSchema(idSchemaUUID), validateSchema(updatedGreenPointSchema), greenPointController.edit);
  greenPointRouter.delete('/:id', validateParamsSchema(idSchemaUUID), greenPointController.delete);

  // Administración de workers en green points
  greenPointRouter.post('/:id/workers', validateParamsSchema(idSchemaUUID), validateSchema(worker_idSchemaUUID), greenPointController.assignWorker);
  greenPointRouter.get('/:id/workers', validateParamsSchema(idSchemaUUID), greenPointController.getWorkers);
  greenPointRouter.get('/workers/assignments', greenPointController.getAllWorkersAssignments);
  greenPointRouter.delete('/:id/workers/:worker_id', validateParamsSchema(idAndWorkerIdSchemaUUID), greenPointController.unassignWorker);

  return greenPointRouter;
}