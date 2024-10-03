import { z } from 'zod';

export const OccupationSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
});

export type OccupationInput = z.infer<typeof OccupationSchema>;

export const OccupationUpdateSchema = OccupationSchema.partial().extend({
  code: z.string().min(1, 'Code is required'),
});

export type OccupationUpdate = z.infer<typeof OccupationUpdateSchema>;