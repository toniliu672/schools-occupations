// src/app/api/v1/occupations/[code]/route.ts
import { NextRequest } from 'next/server';
import { OccupationUpdateSchema, OccupationUpdate } from '@/schemas/occupation';
import { prisma } from '@/config/prisma';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { withAuth } from '@/utils/authUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const occupation = await prisma.occupation.findUnique({
      where: { code },
      include: {
        competencyUnits: {
          select: {
            unitCode: true,
            name: true,
          }
        },
      },
    });

    if (!occupation) {
      return errorResponse('Occupation not found', 404);
    }

    return successResponse(occupation);
  } catch (error) {
    console.error('Error in GET /occupations/[code]:', error);
    return errorResponse('Failed to fetch occupation data', 500);
  }
}

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { code: string } }
) => {
  try {
    const { code } = params;
    const body = await request.json();
    const validatedData: OccupationUpdate = OccupationUpdateSchema.parse(body);

    const { name, competencyUnits } = validatedData;

    const updatedOccupation = await prisma.occupation.update({
      where: { code },
      data: {
        name: name || undefined,
        competencyUnits: competencyUnits ? {
          set: [], // Remove all existing connections
          connect: competencyUnits.map(unitCode => ({ unitCode })) // Connect new competency units
        } : undefined,
      },
      include: { schools: true, competencyUnits: true },
    });

    return successResponse(updatedOccupation);
  } catch (error) {
    console.error('Error in PUT /occupations/[code]:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('An occupation with this name already exists', 400);
      }
      if (error.code === 'P2025') {
        return errorResponse('Occupation not found', 404);
      }
    }
    return errorResponse('Failed to update occupation data', 500);
  }
})

export const DELETE = withAuth(async (
  _request: NextRequest,
  { params }: { params: { code: string } }
) => {
  try {
    const { code } = params;
    await prisma.occupation.delete({ where: { code } });
    return successResponse({ message: 'Occupation successfully deleted' });
  } catch (error) {
    console.error('Error in DELETE /occupations/[code]:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return errorResponse('Occupation not found', 404);
      }
    }
    return errorResponse('Failed to delete occupation', 500);
  }
})