import { z } from 'zod';

export const OccupationSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  competencyUnits: z.array(z.string()).optional(),
});

export type OccupationInput = z.infer<typeof OccupationSchema>;

export const OccupationUpdateSchema = z.object({
  code: z.string().min(1, 'Code is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  competencyUnits: z.array(z.string()).optional(),
}).strict();

export type OccupationUpdate = z.infer<typeof OccupationUpdateSchema>;