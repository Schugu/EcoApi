import { z } from 'zod';

export const ProcessCtrSchema = z.object({
  name: z.string({
    invalid_type_error: "El name debe ser texto.",
    required_error: "El name es requerido."
  }).min(4, { message: "El name debe tener como minimo 4 caracteres." })
    .max(250, { message: "El name no debe tener más de 255 caracteres." }),

  address: z.string({
    invalid_type_error: "El address debe ser texto.",
    required_error: "El address es requerido."
  }).min(4, { message: "El address debe tener como minimo 4 caracteres." })
    .max(250, { message: "El address no debe tener más de 255 caracteres." }),

  town: z.string({
    invalid_type_error: "El town debe ser texto.",
    required_error: "El town es requerido."
  }).min(4, { message: "El town debe tener como minimo 4 caracteres." })
    .max(250, { message: "El town no debe tener más de 255 caracteres." }),
});

export const updatedProcessCtrSchema = ProcessCtrSchema.partial();