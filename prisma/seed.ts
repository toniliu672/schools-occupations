import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin_password', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log({ admin })

  // Seed CompetencyUnits
  const reading = await prisma.competencyUnit.create({
    data: {
      name: 'membaca',
    },
  })

  const counting = await prisma.competencyUnit.create({
    data: {
      name: 'berhitung',
    },
  })

  // Seed Occupations
  const language = await prisma.occupation.create({
    data: {
      code: '1111',
      name: 'Bahasa',
      competencyUnits: {
        connect: { id: reading.id },
      },
    },
  })

  const math = await prisma.occupation.create({
    data: {
      code: '2222',
      name: 'Matematika',
      competencyUnits: {
        connect: { id: counting.id },
      },
    },
  })

  // Seed School
  const school = await prisma.school.create({
    data: {
      name: 'SMKN 1 Tondano',
      city: 'Tondano',
      address: 'Jl. Tondano',
      description: 'Sekolah Kejuruan Tondano',
      studentCount: 100,
      graduateCount: 80,
      graduatePercent: 80,
      externalLinks: ['Link 1', 'Link 2'],
      occupations: {
        connect: [
          { code: language.code },
          { code: math.code },
        ],
      },
    },
  })

  console.log({ school })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })