import { z } from 'zod';

export const SchoolSchema = z.object({
  name: z.string().min(1, 'School name is required').transform(val => val.trim()),
  city: z.string().min(1, 'City is required').transform(val => val.trim()),
  address: z.string().min(1, 'Address is required').transform(val => val.trim()),
  description: z.string().optional(),
  studentCount: z.number().int().nonnegative().default(0),
  graduateCount: z.number().int().nonnegative().default(0),
  externalLinks: z.array(z.string().url('Invalid URL')).optional(),
  occupations: z.array(z.object({ code: z.string() })).optional(),
});

export type SchoolInput = z.infer<typeof SchoolSchema>;

export const SchoolUpdateSchema = z.object({
  name: z.string().min(1, 'School name is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  description: z.string().optional(),
  studentCount: z.number().int().nonnegative().optional(),
  graduateCount: z.number().int().nonnegative().optional(),
  externalLinks: z.array(z.string().url('Invalid URL')).optional(),
  occupations: z.array(z.object({ code: z.string() })).optional(),
}).strict();

export type SchoolUpdate = z.infer<typeof SchoolUpdateSchema>;