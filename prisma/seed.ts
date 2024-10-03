import { PrismaClient, Role } from '@prisma/client'
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
      role: Role.ADMIN,
    },
  })

  console.log({ admin })

  // Seed CompetencyUnits
  const reading = await prisma.competencyUnit.upsert({
    where: { unitCode: 'READ001' },
    update: {},
    create: {
      unitCode: 'READ001',
      name: 'Membaca',
    },
  })

  const counting = await prisma.competencyUnit.upsert({
    where: { unitCode: 'COUNT001' },
    update: {},
    create: {
      unitCode: 'COUNT001',
      name: 'Berhitung',
    },
  })

  // Seed Occupations
  const language = await prisma.occupation.upsert({
    where: { code: '1111' },
    update: {},
    create: {
      code: '1111',
      name: 'Bahasa',
      competencyUnits: {
        connect: { unitCode: reading.unitCode },
      },
    },
  })

  const math = await prisma.occupation.upsert({
    where: { code: '2222' },
    update: {},
    create: {
      code: '2222',
      name: 'Matematika',
      competencyUnits: {
        connect: { unitCode: counting.unitCode },
      },
    },
  })

  // Seed School
  const school = await prisma.school.upsert({
    where: { name: 'SMKN 1 Tondano' },
    update: {},
    create: {
      name: 'SMKN 1 Tondano',
      city: 'Tondano',
      address: 'Jl. Raya Tondano',
      description: 'Sekolah Menengah Kejuruan Negeri 1 Tondano',
      studentCount: 1000,
      graduateCount: 250,
      graduatePercent: 25,
      externalLinks: ['https://smkn1tondano.sch.id', 'https://facebook.com/smkn1tondano'],
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