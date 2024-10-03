import { Prisma } from '@prisma/client';

// School types
export type School = Prisma.SchoolGetPayload<{
  include: { occupations: true }
}>;

export type SchoolInput = Omit<
  Prisma.SchoolCreateInput,
  'occupations' | 'externalLinks'
> & {
  occupations?: { code: string }[];
  externalLinks?: string[];
};

export type SchoolUpdate = Partial<Omit<Prisma.SchoolUpdateInput, 'occupations' | 'externalLinks'>> & {
  id: string;
  occupations?: { code: string }[];
  externalLinks?: string[];
};


// Occupation types
export type Occupation = Prisma.OccupationGetPayload<{
  include: { schools: true; competencyUnits: true }
}>;

export type OccupationInput = Omit<Prisma.OccupationCreateInput, 'schools' | 'competencyUnits'>;
export type OccupationUpdate = Partial<OccupationInput> & {
  code: string;
};

// CompetencyUnit types
export type CompetencyUnit = Prisma.CompetencyUnitGetPayload<{
  include: { occupations: true }
}>;

export type CompetencyUnitInput = Omit<Prisma.CompetencyUnitCreateInput, 'occupations'>;
export type CompetencyUnitUpdate = Partial<CompetencyUnitInput> & {
  id: string;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Query parameter types
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export type SchoolListParams = ListQueryParams;
export type OccupationListParams = ListQueryParams;
export type CompetencyUnitListParams = ListQueryParams;