import { createApp } from "./src/app.js";
import { WorkerModel } from './src/models/mysql/workers.js';
import { AdminModel } from './src/models/mysql/admins.js';
import { GreenPointModel } from './src/models/mysql/greenPoint.js';

createApp({ adminModel: AdminModel, workerModel: WorkerModel, greenPointModel: GreenPointModel });