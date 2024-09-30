import { Router } from 'express';

import { AdminController } from "../controllers/admins.controller.js";

export const createAdminRouter = ({ adminModel }) => {
  const adminsRouter = Router();

  const adminController = new AdminController({ adminModel });


  return adminsRouter;
}