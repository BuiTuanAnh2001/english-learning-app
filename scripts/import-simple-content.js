const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Import nội dung mới vào database...\n')

  // Tạo categories
  console.log('📁 Tạo categories...')
  const beginner = await prisma.category.upsert({
    where: { name: 'beginner' },
    update: {},
    create: { name: 'beginner', description: 'Bài học cơ bản', icon: '🌟' }
  })

  const daily = await prisma.category.upsert({
    where: { name: 'daily' },
    update: {},
    create: { name: 'daily', description: 'Giao tiếp hàng ngày', icon: '💬' }
  })

  const business = await prisma.category.upsert({
    where: { name: 'business' },
    update: {},
    create: { name: 'business', description: 'Tiếng Anh thương mại', icon: '💼' }
  })

  const travel = await prisma.category.upsert({
    where: { name: 'travel' },
    update: {},
    create: { name: 'travel', description: 'Du lịch', icon: '✈️' }
  })

  const advanced = await prisma.category.upsert({
    where: { name: 'advanced' },
    update: {},
    create: { name: 'advanced', description: 'Nâng cao', icon: '🎓' }
  })

  console.log('✅ Categories created!\n')

  // Lesson 1: Colors
  console.log('📚 Lesson 1: Colors and Shapes...')
  await prisma.lesson.create({
    data: {
      title: 'Colors and Shapes',
      description: 'Học các màu sắc và hình dạng cơ bản',
      level: 'beginner',
      duration: '15 phút',
      categoryId: beginner.id,
      vocabulary: {
        create: [
          { word: 'Red', pronunciation: '/red/', meaning: 'Màu đỏ', example: 'The apple is red.', order: 1 },
          { word: 'Blue', pronunciation: '/bluː/', meaning: 'Màu xanh dương', example: 'The sky is blue.', order: 2 },
          { word: 'Green', pronunciation: '/ɡriːn/', meaning: 'Màu xanh lá', example: 'Grass is green.', order: 3 },
          { word: 'Yellow', pronunciation: '/ˈjeləʊ/', meaning: 'Màu vàng', example: 'The sun is yellow.', order: 4 },
          { word: 'Circle', pronunciation: '/ˈsɜːkl/', meaning: 'Hình tròn', example: 'Draw a circle.', order: 5 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What color is it?', meaning: 'Nó màu gì?', example: 'What color is it? It is red.', context: 'Asking about colors', order: 1 },
        ]
      }
    }
  })

  // Lesson 2: Supermarket
  console.log('📚 Lesson 2: At the Supermarket...')
  await prisma.lesson.create({
    data: {
      title: 'At the Supermarket',
      description: 'Học cách mua sắm tại siêu thị',
      level: 'intermediate',
      duration: '25 phút',
      categoryId: daily.id,
      vocabulary: {
        create: [
          { word: 'Aisle', pronunciation: '/aɪl/', meaning: 'Lối đi', example: 'The milk is in aisle 3.', order: 1 },
          { word: 'Cart', pronunciation: '/kɑːrt/', meaning: 'Xe đẩy', example: 'Get a shopping cart.', order: 2 },
          { word: 'Checkout', pronunciation: '/ˈtʃekaʊt/', meaning: 'Quầy thanh toán', example: 'Go to the checkout.', order: 3 },
          { word: 'Receipt', pronunciation: '/rɪˈsiːt/', meaning: 'Hóa đơn', example: 'Keep your receipt.', order: 4 },
          { word: 'Discount', pronunciation: '/ˈdɪskaʊnt/', meaning: 'Giảm giá', example: 'There is a 20% discount.', order: 5 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'How much is this?', meaning: 'Cái này giá bao nhiêu?', example: 'How much is this? Five dollars.', context: 'Asking price', order: 1 },
          { phrase: 'Do you accept cards?', meaning: 'Bạn nhận thẻ không?', example: 'Do you accept cards? Yes, we do.', context: 'Payment', order: 2 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Customer', text: 'Where is the milk?', translation: 'Sữa ở đâu?', gender: 'female', order: 1 },
          { speaker: 'Staff', text: 'In aisle 3, on the left.', translation: 'Ở lối 3, bên trái.', gender: 'male', order: 2 },
        ]
      }
    }
  })

  // Lesson 3: Idioms
  console.log('📚 Lesson 3: Common Idioms...')
  await prisma.lesson.create({
    data: {
      title: 'Common English Idioms',
      description: 'Thành ngữ tiếng Anh thông dụng',
      level: 'advanced',
      duration: '35 phút',
      categoryId: advanced.id,
      vocabulary: {
        create: [
          { word: 'Break the ice', pronunciation: '/breɪk ði aɪs/', meaning: 'Phá vỡ ngượng ngùng', example: 'Tell a joke to break the ice.', order: 1 },
          { word: 'Piece of cake', pronunciation: '/piːs əv keɪk/', meaning: 'Dễ dàng', example: 'The test was a piece of cake.', order: 2 },
          { word: 'Under the weather', pronunciation: '/ˈʌndər ðə ˈweðər/', meaning: 'Không khỏe', example: 'I feel under the weather today.', order: 3 },
          { word: 'Spill the beans', pronunciation: '/spɪl ðə biːnz/', meaning: 'Tiết lộ bí mật', example: 'Don\'t spill the beans!', order: 4 },
          { word: 'Cost an arm and a leg', pronunciation: '/kɒst ən ɑːm ənd ə leɡ/', meaning: 'Rất đắt', example: 'This car costs an arm and a leg.', order: 5 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'It\'s raining cats and dogs', meaning: 'Mưa to', example: 'Take an umbrella. It\'s raining cats and dogs.', context: 'Weather idiom', order: 1 },
          { phrase: 'Better late than never', meaning: 'Muộn còn hơn không', example: 'You finally came. Better late than never.', context: 'Common saying', order: 2 },
        ]
      }
    }
  })

  // Lesson 4: Business Meeting
  console.log('📚 Lesson 4: Business Meetings...')
  await prisma.lesson.create({
    data: {
      title: 'Business Meetings',
      description: 'Họp công việc chuyên nghiệp',
      level: 'advanced',
      duration: '30 phút',
      categoryId: business.id,
      vocabulary: {
        create: [
          { word: 'Agenda', pronunciation: '/əˈdʒendə/', meaning: 'Chương trình họp', example: 'Let\'s review the agenda.', order: 1 },
          { word: 'Minutes', pronunciation: '/ˈmɪnɪts/', meaning: 'Biên bản', example: 'Please take the minutes.', order: 2 },
          { word: 'Proposal', pronunciation: '/prəˈpəʊzl/', meaning: 'Đề xuất', example: 'I have a proposal.', order: 3 },
          { word: 'Budget', pronunciation: '/ˈbʌdʒɪt/', meaning: 'Ngân sách', example: 'What is the budget?', order: 4 },
          { word: 'Deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'Thời hạn', example: 'The deadline is Friday.', order: 5 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Let\'s get started', meaning: 'Bắt đầu thôi', example: 'Everyone is here. Let\'s get started.', context: 'Opening meeting', order: 1 },
          { phrase: 'To sum up', meaning: 'Tóm lại', example: 'To sum up, we need more time.', context: 'Concluding', order: 2 },
        ]
      }
    }
  })

  // Lesson 5: Hotel
  console.log('📚 Lesson 5: At the Hotel...')
  await prisma.lesson.create({
    data: {
      title: 'At the Hotel',
      description: 'Đặt phòng và giao tiếp tại khách sạn',
      level: 'intermediate',
      duration: '23 phút',
      categoryId: travel.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezərˈveɪʃn/', meaning: 'Đặt phòng', example: 'I have a reservation.', order: 1 },
          { word: 'Check-in', pronunciation: '/ˈtʃek ɪn/', meaning: 'Nhận phòng', example: 'Check-in is at 2 PM.', order: 2 },
          { word: 'Check-out', pronunciation: '/ˈtʃek aʊt/', meaning: 'Trả phòng', example: 'Check-out is at 11 AM.', order: 3 },
          { word: 'Wi-Fi', pronunciation: '/ˈwaɪfaɪ/', meaning: 'Wifi', example: 'What is the Wi-Fi password?', order: 4 },
          { word: 'Luggage', pronunciation: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý', example: 'Where is my luggage?', order: 5 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Guest', text: 'I have a reservation under Smith.', translation: 'Tôi đặt phòng tên Smith.', gender: 'male', order: 1 },
          { speaker: 'Receptionist', text: 'Welcome, Mr. Smith. Here is your key.', translation: 'Chào ông Smith. Đây là chìa khóa.', gender: 'female', order: 2 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã import 5 bài học mới với:')
  console.log('   - 25 từ vựng')
  console.log('   - 7 cụm từ')
  console.log('   - 4 đoạn hội thoại\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
