import { z } from 'zod';

export const DonationSchema = z.object({
  donor_id: z.string({
    invalid_type_error: "El id debe ser texto.",
    required_error: "El id es requerido."
  })
});