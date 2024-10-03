import { z } from 'zod';

export const CompetencyUnitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  occupations: z.array(z.object({ code: z.string() })).optional(),
});

export type CompetencyUnitInput = z.infer<typeof CompetencyUnitSchema>;

// Perhatikan perubahan di sini
export const CompetencyUnitUpdateSchema = CompetencyUnitSchema.partial();

export type CompetencyUnitUpdate = z.infer<typeof CompetencyUnitUpdateSchema>;