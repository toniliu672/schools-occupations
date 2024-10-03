import { z } from 'zod';

export const CompetencyUnitSchema = z.object({
  unitCode: z.string().min(1, 'Unit code is required'),
  name: z.string().min(1, 'Name is required'),
  occupations: z.array(z.object({ code: z.string() })).optional(),
});

export type CompetencyUnitInput = z.infer<typeof CompetencyUnitSchema>;

export const CompetencyUnitUpdateSchema = CompetencyUnitSchema.partial().omit({ unitCode: true });

export type CompetencyUnitUpdate = z.infer<typeof CompetencyUnitUpdateSchema>;