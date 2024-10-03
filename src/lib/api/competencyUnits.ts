import { CompetencyUnit, CompetencyUnitInput, CompetencyUnitUpdate, CompetencyUnitListParams } from '@/types/api';

const API_URL = '/api/v1/competencyUnits';

export async function getCompetencyUnits(params: CompetencyUnitListParams = {}): Promise<{ items: CompetencyUnit[], totalPages: number }> {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_URL}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch competency units');
  }
  const data = await response.json();
  return data.data;
}

export async function getCompetencyUnitById(id: string): Promise<CompetencyUnit> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch competency unit details');
  }
  const data = await response.json();
  return data.data;
}

export async function createCompetencyUnit(unitData: CompetencyUnitInput): Promise<CompetencyUnit> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unitData),
  });
  if (!response.ok) {
    throw new Error('Failed to create competency unit');
  }
  const data = await response.json();
  return data.data;
}

export async function updateCompetencyUnit(id: string, unitData: CompetencyUnitUpdate): Promise<CompetencyUnit> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(unitData),
  });
  if (!response.ok) {
    throw new Error('Failed to update competency unit');
  }
  const data = await response.json();
  return data.data;
}

export async function deleteCompetencyUnit(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete competency unit');
  }
}