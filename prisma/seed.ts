// NOTE: Run 'npm run db:generate' first to generate Prisma Client
// This file will have TypeScript errors until Prisma Client is generated
// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { lessons as defaultLessons, categories as defaultCategories } from '../lib/data/lessons'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  console.log('👤 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vocaplanet.com' },
    update: {},
    create: {
      email: 'admin@vocaplanet.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create categories
  console.log('📁 Creating categories...')
  const categoryMap = new Map<string, string>()
  
  for (const cat of defaultCategories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        description: cat.description,
        icon: cat.icon
      },
      create: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon
      }
    })
    categoryMap.set(cat.id, category.id)
    console.log(`  ✓ Category: ${category.name}`)
  }

  // Create lessons
  console.log('📚 Creating lessons...')
  
  for (const lesson of defaultLessons) {
    const categoryId = categoryMap.get(lesson.category) || categoryMap.values().next().value

    const createdLesson = await prisma.lesson.create({
      data: {
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        thumbnailUrl: lesson.thumbnailUrl,
        categoryId,
        vocabulary: {
          create: lesson.vocabulary.map((v, index) => ({
            word: v.word,
            pronunciation: v.pronunciation,
            meaning: v.meaning,
            example: v.example,
            imageUrl: v.imageUrl,
            tags: v.tags || [],
            order: index
          }))
        },
        phrases: {
          create: lesson.phrases.map((p, index) => ({
            phrase: p.phrase,
            meaning: p.meaning,
            example: p.example,
            context: p.context,
            imageUrl: p.imageUrl,
            order: index
          }))
        },
        dialogues: {
          create: lesson.dialogues.map((d, index) => ({
            speaker: d.speaker,
            text: d.text,
            translation: d.translation,
            emotion: d.emotion,
            gender: d.gender,
            order: index
          }))
        },
        objectives: {
          create: (lesson.objectives || []).map((obj, index) => ({
            text: obj,
            order: index
          }))
        },
        tips: {
          create: (lesson.tips || []).map((tip, index) => ({
            text: tip,
            order: index
          }))
        }
      }
    })
    
    console.log(`  ✓ Lesson: ${createdLesson.title} (${lesson.vocabulary.length} vocab, ${lesson.phrases.length} phrases)`)
  }

  console.log('🎉 Database seeded successfully!')
  console.log('📊 Summary:')
  console.log(`  - Categories: ${categoryMap.size}`)
  console.log(`  - Lessons: ${defaultLessons.length}`)
  console.log(`  - Admin email: admin@vocaplanet.com`)
  console.log(`  - Admin password: admin123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
