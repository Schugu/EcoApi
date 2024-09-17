import { createApp } from "./src/app.js";
import { WorkerModel } from './src/models/mysql/workers.js';
import { AdminModel } from './src/models/mysql/admins.js';

createApp({ workerModel: WorkerModel, adminModel: AdminModel });