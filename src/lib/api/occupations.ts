import { Occupation, OccupationInput, OccupationUpdate, OccupationListParams } from '@/types/api';

const API_URL = '/api/v1/occupations';

export async function getOccupations(params: OccupationListParams = {}): Promise<{ items: Occupation[], totalPages: number }> {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_URL}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch occupations');
  }
  const data = await response.json();
  return data.data;
}

export async function getOccupationByCode(code: string): Promise<Occupation> {
  const response = await fetch(`${API_URL}/${code}`);
  if (!response.ok) {
    throw new Error('Failed to fetch occupation details');
  }
  const data = await response.json();
  return data.data;
}

export async function createOccupation(occupationData: OccupationInput): Promise<Occupation> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(occupationData),
  });
  if (!response.ok) {
    throw new Error('Failed to create occupation');
  }
  const data = await response.json();
  return data.data;
}

export async function updateOccupation(oldCode: string, occupationData: OccupationUpdate): Promise<Occupation> {
  const response = await fetch(`${API_URL}/${oldCode}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(occupationData),
  });
  if (!response.ok) {
    throw new Error('Failed to update occupation');
  }
  const data = await response.json();
  return data.data;
}

export async function deleteOccupation(code: string): Promise<void> {
  const response = await fetch(`${API_URL}/${code}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete occupation');
  }
}