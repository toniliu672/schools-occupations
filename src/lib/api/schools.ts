import { School, SchoolInput, SchoolUpdate, SchoolListParams } from '@/types/api';

const API_URL = '/api/v1/schools';

export async function getSchools(params: SchoolListParams = {}): Promise<{ items: School[], totalPages: number }> {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_URL}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch schools');
  }
  const data = await response.json();
  return data.data;
}

export async function getSchoolById(id: string): Promise<School> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch school details');
  }
  const data = await response.json();
  return data.data;
}

export async function createSchool(schoolData: SchoolInput): Promise<School> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolData),
  });
  if (!response.ok) {
    throw new Error('Failed to create school');
  }
  const data = await response.json();
  return data.data;
}

export async function updateSchool(id: string, schoolData: SchoolUpdate): Promise<School> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schoolData),
  });
  if (!response.ok) {
    throw new Error('Failed to update school');
  }
  const data = await response.json();
  return data.data;
}

export async function deleteSchool(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete school');
  }
}