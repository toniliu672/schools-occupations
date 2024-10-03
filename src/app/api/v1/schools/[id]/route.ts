// src/app/api/v1/schools/[id]/route.ts
import { NextRequest } from "next/server";
import { SchoolUpdate, SchoolUpdateSchema } from "@/schemas/school";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/utils/authUtils";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const school = await prisma.school.findUnique({
      where: { id },
      include: { occupations: true },
    });

    if (!school) {
      return errorResponse('School not found', 404);
    }

    return successResponse(school);
  } catch (error) {
    console.error('Error in GET /schools/[id]:', error);
    return errorResponse('Failed to fetch school data', 500);
  }
}

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    if (!id) {
      return errorResponse("School ID is required", 400);
    }

    const body = await request.json();
    const validatedData: SchoolUpdate = SchoolUpdateSchema.parse(body);

    const {
      name,
      city,
      address,
      description,
      studentCount,
      graduateCount,
      externalLinks,
      occupations,
    } = validatedData;

    // Check if the school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id },
    });

    if (!existingSchool) {
      return errorResponse("School not found", 404);
    }

    // Check if the school name already exists (if name is being changed)
    if (name && name !== existingSchool.name) {
      const duplicateSchool = await prisma.school.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });
      if (duplicateSchool) {
        return errorResponse(
          "School name is already used by another school",
          400
        );
      }
    }

    // Check if all given occupations exist in the database
    let existingOccupations: string[] = [];
    if (occupations && occupations.length > 0) {
      existingOccupations = await prisma.occupation
        .findMany({
          where: { code: { in: occupations.map(o => o.code) } },
          select: { code: true },
        })
        .then((occs) => occs.map((o) => o.code));
    }

    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        name: name || undefined,
        city: city || undefined,
        address: address || undefined,
        description: description || undefined,
        studentCount: studentCount || undefined,
        graduateCount: graduateCount || undefined,
        externalLinks: externalLinks || undefined,
        occupations: occupations
          ? {
              set: [],
              connect: existingOccupations.map((code) => ({ code })),
            }
          : undefined,
      },
      include: { occupations: true },
    });

    // If some occupations were not found, notify the user
    const notFoundOccupations = occupations
      ? occupations.filter((o) => !existingOccupations.includes(o.code)).map(o => o.code)
      : [];
    
    if (notFoundOccupations.length > 0) {
      return successResponse({
        school: updatedSchool,
        warning: `Some occupations were not found: ${notFoundOccupations.join(", ")}`,
      });
    }

    return successResponse({ school: updatedSchool });
  } catch (error) {
    console.error("Error in PUT /schools/[id]:", error);
    if (error instanceof z.ZodError) {
      return errorResponse(
        error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
        400
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return errorResponse("School name is already in use", 400);
      }
      if (error.code === "P2025") {
        return errorResponse("School not found", 404);
      }
    }
    return errorResponse("Failed to update school data", 500);
  }
})

export const DELETE = withAuth(async (
  _request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    await prisma.school.delete({ where: { id } });
    return successResponse({ message: "School successfully deleted" });
  } catch (error) {
    console.error("Error in DELETE /schools/[id]:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return errorResponse("School not found", 404);
      }
    }
    return errorResponse("Failed to delete school", 500);
  }
})