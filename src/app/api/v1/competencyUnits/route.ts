import { NextRequest } from 'next/server';
import { CompetencyUnitSchema, CompetencyUnitInput } from '@/schemas/competencyUnit';
import { prisma } from '@/config/prisma';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || undefined;

  try {
    const [competencyUnits, total] = await prisma.$transaction([
      prisma.competencyUnit.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: search ? {
          OR: [
            { unitCode: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        include: {
          occupations: {
            select: {
              code: true,
              name: true,
            }
          },
        },
      }),
      prisma.competencyUnit.count(search ? {
        where: {
          OR: [
            { unitCode: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        },
      } : undefined),
    ]);

    return successResponse({
      items: competencyUnits,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error in GET /competency-units:', error);
    return errorResponse('Failed to fetch competency units');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData: CompetencyUnitInput = CompetencyUnitSchema.parse(body);
    
    const { unitCode, name, occupations } = validatedData;
    
    const newCompetencyUnit = await prisma.competencyUnit.create({
      data: {
        unitCode,
        name,
        occupations: occupations ? {
          connect: occupations.map(({ code }) => ({ code }))
        } : undefined
      },
      include: { occupations: true },
    });
    
    return successResponse(newCompetencyUnit, 201);
  } catch (error) {
    console.error('Error in POST /competency-units:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('A competency unit with this unit code already exists', 400);
      }
    }
    return errorResponse('Failed to create competency unit', 500);
  }
}