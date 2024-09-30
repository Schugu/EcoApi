import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { workerSchema, updateWorkerSchema } from "../schemas/workers.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

import { WorkerController } from "../controllers/workers.controller.js";


export const createWorkerRouter = ({ workerModel }) => {
  const workersRouter = Router();

  const workerController = new WorkerController({ workerModel });

  // Administrar Workers
  workersRouter.post('/', validateSchema(workerSchema), workerController.newWorker);
  workersRouter.get('/', workerController.getAllWorkers);
  workersRouter.get('/:id', validateParamsSchema(idSchemaUUID), workerController.getWorkerById);
  workersRouter.patch('/:id', validateParamsSchema(idSchemaUUID), validateSchema(updateWorkerSchema), workerController.editWorkerById);
  workersRouter.delete('/:id', validateParamsSchema(idSchemaUUID), workerController.deleteWorkerById);

  return workersRouter;
}