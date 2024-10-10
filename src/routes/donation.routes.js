import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { validateParamsSchema } from "../middlewares/validateParamsSchema.js";

import { DonationSchema } from "../schemas/donation.js";
import { idSchemaUUID, worker_idSchemaUUID, idAndWorkerIdSchemaUUID } from "../schemas/utilsSchemas.js";

import { DonationController } from "../controllers/donation.controller.js";

export const createDonationRouter = ({ donationModel }) => {
  const donationRouter = Router();

  const donationController = new DonationController({ donationModel });

  donationRouter.post('/', validateSchema(DonationSchema), donationController.new);
 
  return donationRouter;
}