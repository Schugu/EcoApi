import { z } from 'zod';

export const workerSchema = z.object({
  username: z.string({
    invalid_type_error: "El username debe ser texto.",
    required_error: "El username es requerido."
  }).min(4, { message: "El username debe tener como minimo 4 caracteres." })
    .max(30, { message: "El username no debe tener más de 30 caracteres." }),

  email: z.string({
    invalid_type_error: "El email debe ser texto.",
    required_error: "El email es requerido."
  })
    .email({ message: "El correo electrónico ingresado no es válido." }),

  password: z
    .string({ required_error: "La contraseña es requerida." })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(20, { message: "La contraseña no debe exceder los 20 caracteres." })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
    .regex(/\d/, { message: "La contraseña debe contener al menos un número." })
    .regex(/[@$!%*?&.]/, { message: "La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &, .)." })
});

export const loginSchema = workerSchema.pick({
  username: true,
  password: true
});

export const updateWorkerSchema = workerSchema.partial();