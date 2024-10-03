import { NextRequest } from 'next/server';
import { CompetencyUnitUpdateSchema, CompetencyUnitUpdate } from '@/schemas/competencyUnit';
import { prisma } from '@/config/prisma';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const competencyUnit = await prisma.competencyUnit.findUnique({
      where: { id },
      include: {
        occupations: {
          select: {
            code: true,
            name: true,
          }
        },
      },
    });

    if (!competencyUnit) {
      return errorResponse('Competency unit not found', 404);
    }

    return successResponse(competencyUnit);
  } catch (error) {
    console.error('Error in GET /competencyUnits/[id]:', error);
    return errorResponse('Failed to fetch competency unit data', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData: CompetencyUnitUpdate = CompetencyUnitUpdateSchema.parse(body);

    const { name, occupations } = validatedData;

    const updatedCompetencyUnit = await prisma.competencyUnit.update({
      where: { id },
      data: {
        name: name || undefined,
        occupations: occupations ? {
          set: [],
          connect: occupations.map(({ code }) => ({ code }))
        } : undefined,
      },
      include: {
        occupations: {
          select: {
            code: true,
            name: true,
          }
        },
      },
    });

    return successResponse(updatedCompetencyUnit);
  } catch (error) {
    console.error('Error in PUT /competencyUnits/[id]:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('A competency unit with this name already exists', 400);
      }
      if (error.code === 'P2025') {
        return errorResponse('Competency unit not found', 404);
      }
    }
    return errorResponse('Failed to update competency unit data', 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.competencyUnit.delete({ where: { id } });
    return successResponse({ message: 'Competency unit successfully deleted' });
  } catch (error) {
    console.error('Error in DELETE /competencyUnits/[id]:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return errorResponse('Competency unit not found', 404);
      }
    }
    return errorResponse('Failed to delete competency unit', 500);
  }
}