import { NextRequest } from 'next/server';
import { SchoolSchema, SchoolInput } from '@/schemas/school';
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
    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        include: { occupations: true },
      }),
      prisma.school.count(search ? {
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ],
        },
      } : undefined),
    ]);

    return successResponse({
      items: schools,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error in GET /schools:', error);
    return errorResponse('Gagal mengambil data sekolah');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const validatedData: SchoolInput = SchoolSchema.parse(body);
    console.log('Validated data:', validatedData);
    
    const { name, city, address, description, studentCount, graduateCount, externalLinks, occupations } = validatedData;
    
    // Cek apakah semua occupations yang diberikan ada di database
    let existingOccupations: string[] = [];
    if (occupations && occupations.length > 0) {
      existingOccupations = await prisma.occupation.findMany({
        where: { code: { in: occupations.map(o => o.code) } },
        select: { code: true },
      }).then(occs => occs.map(o => o.code));
    }

    // Buat sekolah baru
    const newSchool = await prisma.school.create({
      data: {
        name,
        city,
        address,
        description,
        studentCount,
        graduateCount,
        externalLinks: externalLinks || [],
        occupations: occupations && occupations.length > 0 ? {
          connect: occupations.map(({ code }) => ({ code }))
        } : undefined
      },
      include: { occupations: true }
    });
    
    // Jika ada occupations yang tidak ditemukan, beri tahu user
    const notFoundOccupations = occupations 
      ? occupations.filter(o => !existingOccupations.includes(o.code)).map(o => o.code)
      : [];
    if (notFoundOccupations.length > 0) {
      return successResponse({
        school: newSchool,
        warning: `Beberapa okupasi tidak ditemukan: ${notFoundOccupations.join(', ')}`
      }, 201);
    }

    return successResponse(newSchool, 201);
  } catch (error) {
    console.error('Error in POST /schools:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 400);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('Sekolah dengan nama ini sudah ada', 400);
      }
    }
    return errorResponse('Gagal membuat data sekolah', 500);
  }
}