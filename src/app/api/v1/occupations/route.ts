import { NextRequest } from 'next/server';
import { OccupationSchema, OccupationInput } from '@/schemas/occupation';
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
    const [occupations, total] = await prisma.$transaction([
      prisma.occupation.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: search ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        include: {
          competencyUnits: {
            select: {
              unitCode: true,
              name: true,
            }
          },
        },
      }),
      prisma.occupation.count(search ? {
        where: {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        },
      } : undefined),
    ]);

    return successResponse({
      items: occupations,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error in GET /occupations:', error);
    return errorResponse('Failed to fetch occupations');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData: OccupationInput = OccupationSchema.parse(body);
    
    const { code, name, competencyUnits } = validatedData;
    
    // Buat array untuk menyimpan unit kompetensi yang akan dihubungkan
    const competencyUnitsToConnect: { unitCode: string }[] = [];
    
    // Jika ada unit kompetensi, proses masing-masing
    if (competencyUnits && competencyUnits.length > 0) {
      for (const unitCode of competencyUnits) {
        // Cek apakah unit kompetensi sudah ada
        let existingUnit = await prisma.competencyUnit.findUnique({
          where: { unitCode },
        });

        // Jika belum ada, buat unit kompetensi baru
        if (!existingUnit) {
          existingUnit = await prisma.competencyUnit.create({
            data: {
              unitCode,
              name: unitCode, // Gunakan unitCode sebagai nama jika tidak ada nama yang disediakan
            },
          });
        }

        // Tambahkan ke array untuk dihubungkan
        competencyUnitsToConnect.push({ unitCode: existingUnit.unitCode });
      }
    }

    const newOccupation = await prisma.occupation.create({
      data: {
        code,
        name,
        competencyUnits: {
          connect: competencyUnitsToConnect
        }
      },
      include: { schools: true, competencyUnits: true },
    });
    
    return successResponse(newOccupation, 201);
  } catch (error) {
    console.error('Error in POST /occupations:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('An occupation with this code or name already exists', 400);
      }
    }
    return errorResponse('Failed to create occupation', 500);
  }
}