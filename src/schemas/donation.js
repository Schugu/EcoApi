import { z } from 'zod';

const DonationItemSchema = z.object({
  material_type: z.string().min(1, { message: "El tipo de material es requerido." }), 
  weight: z.number().positive({ message: "El peso debe ser un número positivo." }), 
});

export const DonationSchema = z.object({
  donor_id: z.string()
    .min(8, { message: "El ID del donante debe tener al menos 8 caracteres." }) 
    .max(20, { message: "El ID del donante no debe exceder los 20 caracteres." }), 

  items: z.array(DonationItemSchema).nonempty({ message: "Debe proporcionar al menos un ítem para la donación." }) 
});