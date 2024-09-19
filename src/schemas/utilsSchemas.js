import { z } from 'zod';

const uuidSchema = z.string({
  invalid_type_error: "Debe ser STRING.",
  required_error: "Es requerido."
}).uuid({ message: "Formato de UUID invalido." });

export const idSchemaUUID = z.object({
  id: uuidSchema
});

export const worker_idSchemaUUID = z.object({
  worker_id: uuidSchema
});

export const idAndWorkerIdSchemaUUID = z.object({
  id: uuidSchema,
  worker_id: uuidSchema
});