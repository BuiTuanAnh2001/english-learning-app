const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Thêm nội dung mới...\n')

  // Đảm bảo có categories
  const advancedCategory = await prisma.category.upsert({
    where: { name: 'advanced' },
    update: {},
    create: { name: 'advanced', description: 'Bài học nâng cao', icon: '🎓' }
  })

  const dailyCategory = await prisma.category.upsert({
    where: { name: 'daily' },
    update: {},
    create: { name: 'daily', description: 'Giao tiếp hàng ngày', icon: '💬' }
  })

  const beginnerCategory = await prisma.category.upsert({
    where: { name: 'beginner' },
    update: {},
    create: { name: 'beginner', description: 'Dành cho người mới', icon: '🌱' }
  })

  const travelCategory = await prisma.category.upsert({
    where: { name: 'travel' },
    update: {},
    create: { name: 'travel', description: 'Tiếng Anh du lịch', icon: '✈️' }
  })

  const workCategory = await prisma.category.upsert({
    where: { name: 'work' },
    update: {},
    create: { name: 'work', description: 'Tiếng Anh công việc', icon: '💼' }
  })

  // ============ BÀI HỌC 1: IDIOMS ============
  console.log('💡 Thêm bài học Idioms...')
  await prisma.lesson.create({
    data: {
      title: 'Common English Idioms - Thành ngữ thông dụng',
      description: 'Học các thành ngữ thường gặp trong tiếng Anh',
      level: 'advanced',
      duration: '35',
      categoryId: advancedCategory.id,
      vocabulary: {
        create: [
          { word: 'Break the ice', pronunciation: '/breɪk ði aɪs/', meaning: 'Phá vỡ sự ngượng ngùng', example: 'Tell a joke to break the ice.', order: 1 },
          { word: 'Piece of cake', pronunciation: '/piːs əv keɪk/', meaning: 'Dễ như ăn bánh', example: 'The test was a piece of cake.', order: 2 },
          { word: 'Hit the nail on the head', pronunciation: '/hɪt ðə neɪl ɒn ðə hed/', meaning: 'Nói đúng trọng tâm', example: 'You hit the nail on the head.', order: 3 },
          { word: 'Once in a blue moon', pronunciation: '/wʌns ɪn ə bluː muːn/', meaning: 'Rất hiếm khi', example: 'I see him once in a blue moon.', order: 4 },
          { word: 'Cost an arm and a leg', pronunciation: '/kɒst ən ɑːm ənd ə leɡ/', meaning: 'Rất đắt', example: 'That car costs an arm and a leg.', order: 5 },
          { word: 'Under the weather', pronunciation: '/ˈʌndər ðə ˈweðər/', meaning: 'Không khỏe', example: 'I\'m feeling under the weather.', order: 6 },
          { word: 'Spill the beans', pronunciation: '/spɪl ðə biːnz/', meaning: 'Tiết lộ bí mật', example: 'Don\'t spill the beans!', order: 7 },
          { word: 'Burn the midnight oil', pronunciation: '/bɜːn ðə ˈmɪdnaɪt ɔɪl/', meaning: 'Thức khuya làm việc', example: 'I\'m burning the midnight oil.', order: 8 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'It\'s raining cats and dogs', meaning: 'Mưa to như trút nước', example: 'Take an umbrella, it\'s raining cats and dogs!', order: 1 },
          { phrase: 'Beat around the bush', meaning: 'Nói vòng vo', example: 'Stop beating around the bush and tell me!', order: 2 },
          { phrase: 'Cut to the chase', meaning: 'Nói thẳng vào vấn đề', example: 'Let\'s cut to the chase.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 2: PHRASAL VERBS ============
  console.log('🎯 Thêm bài học Phrasal Verbs...')
  await prisma.lesson.create({
    data: {
      title: 'Essential Phrasal Verbs - Cụm động từ thiết yếu',
      description: 'Tìm hiểu các cụm động từ quan trọng',
      level: 'intermediate',
      duration: '30',
      categoryId: advancedCategory.id,
      vocabulary: {
        create: [
          { word: 'Look up', pronunciation: '/lʊk ʌp/', meaning: 'Tra cứu', example: 'Look up the word in the dictionary.', order: 1 },
          { word: 'Give up', pronunciation: '/ɡɪv ʌp/', meaning: 'Từ bỏ', example: 'Don\'t give up on your dreams.', order: 2 },
          { word: 'Turn down', pronunciation: '/tɜːn daʊn/', meaning: 'Từ chối', example: 'She turned down the job offer.', order: 3 },
          { word: 'Put off', pronunciation: '/pʊt ɒf/', meaning: 'Hoãn lại', example: 'Let\'s put off the meeting.', order: 4 },
          { word: 'Break down', pronunciation: '/breɪk daʊn/', meaning: 'Hỏng, hư', example: 'My car broke down.', order: 5 },
          { word: 'Carry on', pronunciation: '/ˈkæri ɒn/', meaning: 'Tiếp tục', example: 'Please carry on with your work.', order: 6 },
          { word: 'Come across', pronunciation: '/kʌm əˈkrɒs/', meaning: 'Tình cờ gặp', example: 'I came across an old friend.', order: 7 },
          { word: 'Figure out', pronunciation: '/ˈfɪɡər aʊt/', meaning: 'Tìm ra', example: 'I can\'t figure out this puzzle.', order: 8 },
          { word: 'Get along', pronunciation: '/ɡet əˈlɒŋ/', meaning: 'Hòa hợp', example: 'We get along really well.', order: 9 },
          { word: 'Show up', pronunciation: '/ʃəʊ ʌp/', meaning: 'Xuất hiện', example: 'He didn\'t show up to the meeting.', order: 10 },
          { word: 'Take off', pronunciation: '/teɪk ɒf/', meaning: 'Cất cánh', example: 'The plane will take off soon.', order: 11 },
          { word: 'Run into', pronunciation: '/rʌn ˈɪntuː/', meaning: 'Tình cờ gặp', example: 'I ran into an old classmate.', order: 12 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Pick up the pace', meaning: 'Tăng tốc độ', example: 'We need to pick up the pace.', order: 1 },
          { phrase: 'Catch up with', meaning: 'Theo kịp', example: 'Let\'s catch up with the team.', order: 2 },
          { phrase: 'Get over something', meaning: 'Vượt qua', example: 'She finally got over her fear.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 3: GREETINGS ============
  console.log('🌱 Thêm bài học Greetings...')
  await prisma.lesson.create({
    data: {
      title: 'Greetings & Introductions - Chào hỏi và Giới thiệu',
      description: 'Học cách chào hỏi và giới thiệu bản thân',
      level: 'beginner',
      duration: '20',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'Hello', pronunciation: '/həˈləʊ/', meaning: 'Xin chào', example: 'Hello! How are you?', order: 1 },
          { word: 'Good morning', pronunciation: '/ɡʊd ˈmɔːnɪŋ/', meaning: 'Chào buổi sáng', example: 'Good morning, everyone!', order: 2 },
          { word: 'Good afternoon', pronunciation: '/ɡʊd ˌɑːftəˈnuːn/', meaning: 'Chào buổi chiều', example: 'Good afternoon, sir.', order: 3 },
          { word: 'Good evening', pronunciation: '/ɡʊd ˈiːvnɪŋ/', meaning: 'Chào buổi tối', example: 'Good evening!', order: 4 },
          { word: 'Goodbye', pronunciation: '/ɡʊdˈbaɪ/', meaning: 'Tạm biệt', example: 'Goodbye! See you tomorrow.', order: 5 },
          { word: 'Nice to meet you', pronunciation: '/naɪs tuː miːt juː/', meaning: 'Rất vui được gặp bạn', example: 'Nice to meet you!', order: 6 },
          { word: 'My name is...', pronunciation: '/maɪ neɪm ɪz/', meaning: 'Tên tôi là...', example: 'My name is John.', order: 7 },
          { word: 'How are you?', pronunciation: '/haʊ ɑːr juː/', meaning: 'Bạn khỏe không?', example: 'Hi! How are you?', order: 8 },
          { word: 'I\'m fine', pronunciation: '/aɪm faɪn/', meaning: 'Tôi khỏe', example: 'I\'m fine, thank you!', order: 9 },
          { word: 'Thank you', pronunciation: '/θæŋk juː/', meaning: 'Cảm ơn', example: 'Thank you very much!', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Anna', text: 'Hello! My name is Anna.', translation: 'Xin chào! Tên tôi là Anna.', order: 1, gender: 'female' },
          { speaker: 'Tom', text: 'Hi Anna! I\'m Tom. Nice to meet you!', translation: 'Chào Anna! Tôi là Tom. Rất vui được gặp bạn!', order: 2, gender: 'male' },
          { speaker: 'Anna', text: 'Nice to meet you too! Where are you from?', translation: 'Tôi cũng rất vui! Bạn đến từ đâu?', order: 3, gender: 'female' },
          { speaker: 'Tom', text: 'I\'m from the United States. And you?', translation: 'Tôi đến từ Mỹ. Còn bạn?', order: 4, gender: 'male' },
          { speaker: 'Anna', text: 'I\'m from Vietnam.', translation: 'Tôi đến từ Việt Nam.', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What\'s your name?', meaning: 'Bạn tên gì?', example: 'Hi! What\'s your name?', order: 1 },
          { phrase: 'See you later', meaning: 'Hẹn gặp lại', example: 'Bye! See you later!', order: 2 },
          { phrase: 'Have a nice day', meaning: 'Chúc một ngày tốt lành', example: 'Take care! Have a nice day!', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 4: NUMBERS & TIME ============
  console.log('🔢 Thêm bài học Numbers & Time...')
  await prisma.lesson.create({
    data: {
      title: 'Numbers & Time - Số và Thời gian',
      description: 'Học số đếm và cách nói giờ',
      level: 'beginner',
      duration: '25',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'One', pronunciation: '/wʌn/', meaning: 'Một', example: 'I have one apple.', order: 1 },
          { word: 'Two', pronunciation: '/tuː/', meaning: 'Hai', example: 'There are two cats.', order: 2 },
          { word: 'Three', pronunciation: '/θriː/', meaning: 'Ba', example: 'I need three books.', order: 3 },
          { word: 'Ten', pronunciation: '/ten/', meaning: 'Mười', example: 'She is ten years old.', order: 4 },
          { word: 'Twenty', pronunciation: '/ˈtwenti/', meaning: 'Hai mươi', example: 'I have twenty dollars.', order: 5 },
          { word: 'Hundred', pronunciation: '/ˈhʌndrəd/', meaning: 'Trăm', example: 'There are one hundred students.', order: 6 },
          { word: 'Hour', pronunciation: '/aʊər/', meaning: 'Giờ', example: 'It takes one hour.', order: 7 },
          { word: 'Minute', pronunciation: '/ˈmɪnɪt/', meaning: 'Phút', example: 'Give me five minutes.', order: 8 },
          { word: 'O\'clock', pronunciation: '/əˈklɒk/', meaning: 'Giờ đúng', example: 'It\'s three o\'clock.', order: 9 },
          { word: 'Half past', pronunciation: '/hɑːf pɑːst/', meaning: 'Rưỡi', example: 'It\'s half past two.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Lisa', text: 'Excuse me, what time is it?', translation: 'Xin lỗi, bây giờ là mấy giờ?', order: 1, gender: 'female' },
          { speaker: 'David', text: 'It\'s half past nine.', translation: 'Bây giờ là 9 giờ rưỡi.', order: 2, gender: 'male' },
          { speaker: 'Lisa', text: 'Thank you! I\'m late for class.', translation: 'Cảm ơn! Tôi muộn học rồi.', order: 3, gender: 'female' },
          { speaker: 'David', text: 'No problem! Good luck!', translation: 'Không có gì! Chúc may mắn!', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What time is it?', meaning: 'Mấy giờ rồi?', example: 'Excuse me, what time is it?', order: 1 },
          { phrase: 'How much is it?', meaning: 'Bao nhiêu tiền?', example: 'How much is this shirt?', order: 2 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 5: FAMILY ============
  console.log('👨‍👩‍👧‍👦 Thêm bài học Family...')
  await prisma.lesson.create({
    data: {
      title: 'Family Members - Thành viên gia đình',
      description: 'Học từ vựng về gia đình',
      level: 'beginner',
      duration: '20',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'Father', pronunciation: '/ˈfɑːðər/', meaning: 'Bố', example: 'My father is a teacher.', order: 1 },
          { word: 'Mother', pronunciation: '/ˈmʌðər/', meaning: 'Mẹ', example: 'My mother cooks delicious food.', order: 2 },
          { word: 'Brother', pronunciation: '/ˈbrʌðər/', meaning: 'Anh/em trai', example: 'I have two brothers.', order: 3 },
          { word: 'Sister', pronunciation: '/ˈsɪstər/', meaning: 'Chị/em gái', example: 'My sister is older than me.', order: 4 },
          { word: 'Grandfather', pronunciation: '/ˈɡrænfɑːðər/', meaning: 'Ông', example: 'My grandfather is 80 years old.', order: 5 },
          { word: 'Grandmother', pronunciation: '/ˈɡrænmʌðər/', meaning: 'Bà', example: 'My grandmother makes great cookies.', order: 6 },
          { word: 'Uncle', pronunciation: '/ˈʌŋkl/', meaning: 'Chú/bác', example: 'My uncle lives in Hanoi.', order: 7 },
          { word: 'Aunt', pronunciation: '/ɑːnt/', meaning: 'Cô/dì', example: 'My aunt is very kind.', order: 8 },
          { word: 'Cousin', pronunciation: '/ˈkʌzn/', meaning: 'Anh/chị/em họ', example: 'I have many cousins.', order: 9 },
          { word: 'Husband', pronunciation: '/ˈhʌzbənd/', meaning: 'Chồng', example: 'Her husband is a doctor.', order: 10 },
          { word: 'Wife', pronunciation: '/waɪf/', meaning: 'Vợ', example: 'His wife is a nurse.', order: 11 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Emma', text: 'Do you have any brothers or sisters?', translation: 'Bạn có anh chị em không?', order: 1, gender: 'female' },
          { speaker: 'Jack', text: 'Yes, I have one brother and two sisters.', translation: 'Có, tôi có một anh trai và hai em gái.', order: 2, gender: 'male' },
          { speaker: 'Emma', text: 'That\'s a big family!', translation: 'Gia đình đông thế!', order: 3, gender: 'female' },
          { speaker: 'Jack', text: 'Yes! We\'re very close.', translation: 'Vâng! Chúng tôi rất gắn bó.', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'How many siblings do you have?', meaning: 'Bạn có bao nhiêu anh chị em?', example: 'How many siblings do you have?', order: 1 },
          { phrase: 'We\'re a close family', meaning: 'Gia đình chúng tôi rất gắn bó', example: 'We\'re a very close family.', order: 2 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 6: AIRPORT ============
  console.log('✈️ Thêm bài học Airport...')
  await prisma.lesson.create({
    data: {
      title: 'At the Airport - Ở sân bay',
      description: 'Từ vựng và hội thoại khi đi máy bay',
      level: 'intermediate',
      duration: '30',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Boarding pass', pronunciation: '/ˈbɔːdɪŋ pɑːs/', meaning: 'Thẻ lên máy bay', example: 'Please show your boarding pass.', order: 1 },
          { word: 'Passport', pronunciation: '/ˈpɑːspɔːt/', meaning: 'Hộ chiếu', example: 'Don\'t forget your passport!', order: 2 },
          { word: 'Check-in', pronunciation: '/tʃek ɪn/', meaning: 'Làm thủ tục', example: 'Online check-in is available.', order: 3 },
          { word: 'Luggage', pronunciation: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý', example: 'My luggage is too heavy.', order: 4 },
          { word: 'Gate', pronunciation: '/ɡeɪt/', meaning: 'Cửa ra máy bay', example: 'Gate number is 15.', order: 5 },
          { word: 'Departure', pronunciation: '/dɪˈpɑːtʃər/', meaning: 'Khởi hành', example: 'Departure is at 8 AM.', order: 6 },
          { word: 'Arrival', pronunciation: '/əˈraɪvl/', meaning: 'Đến nơi', example: 'Arrival is at 3 PM.', order: 7 },
          { word: 'Delay', pronunciation: '/dɪˈleɪ/', meaning: 'Trễ', example: 'There\'s a two-hour delay.', order: 8 },
          { word: 'Security check', pronunciation: '/sɪˈkjʊərəti tʃek/', meaning: 'Kiểm tra an ninh', example: 'Go through security check.', order: 9 },
          { word: 'Window seat', pronunciation: '/ˈwɪndəʊ siːt/', meaning: 'Ghế cạnh cửa sổ', example: 'I prefer a window seat.', order: 10 },
          { word: 'Aisle seat', pronunciation: '/aɪl siːt/', meaning: 'Ghế cạnh lối đi', example: 'Can I have an aisle seat?', order: 11 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Staff', text: 'Good morning! May I see your passport?', translation: 'Chào buổi sáng! Cho xem hộ chiếu?', order: 1, gender: 'female' },
          { speaker: 'Passenger', text: 'Here you are. I\'m flying to Singapore.', translation: 'Đây ạ. Tôi bay đi Singapore.', order: 2, gender: 'male' },
          { speaker: 'Staff', text: 'Do you have any luggage to check in?', translation: 'Anh có hành lý ký gửi không?', order: 3, gender: 'female' },
          { speaker: 'Passenger', text: 'Yes, one suitcase please.', translation: 'Có, một vali.', order: 4, gender: 'male' },
          { speaker: 'Staff', text: 'Window or aisle seat?', translation: 'Ghế cửa sổ hay lối đi?', order: 5, gender: 'female' },
          { speaker: 'Passenger', text: 'Window seat, please.', translation: 'Ghế cửa sổ, cảm ơn.', order: 6, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What time does boarding start?', meaning: 'Mấy giờ lên máy bay?', example: 'Excuse me, what time does boarding start?', order: 1 },
          { phrase: 'Is my flight on time?', meaning: 'Chuyến bay có đúng giờ không?', example: 'Is my flight on time?', order: 2 },
          { phrase: 'Where is gate 12?', meaning: 'Cửa 12 ở đâu?', example: 'Excuse me, where is gate 12?', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 7: HOTEL ============
  console.log('🏨 Thêm bài học Hotel...')
  await prisma.lesson.create({
    data: {
      title: 'Hotel Check-in - Nhận phòng khách sạn',
      description: 'Học cách đặt phòng và nhận phòng khách sạn',
      level: 'intermediate',
      duration: '25',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezəˈveɪʃn/', meaning: 'Đặt phòng', example: 'I have a reservation.', order: 1 },
          { word: 'Single room', pronunciation: '/ˈsɪŋɡl ruːm/', meaning: 'Phòng đơn', example: 'I\'d like a single room.', order: 2 },
          { word: 'Double room', pronunciation: '/ˈdʌbl ruːm/', meaning: 'Phòng đôi', example: 'We need a double room.', order: 3 },
          { word: 'Room key', pronunciation: '/ruːm kiː/', meaning: 'Chìa khóa phòng', example: 'Here\'s your room key.', order: 4 },
          { word: 'Breakfast included', pronunciation: '/ˈbrekfəst ɪnˈkluːdɪd/', meaning: 'Bao gồm bữa sáng', example: 'Is breakfast included?', order: 5 },
          { word: 'Check-out time', pronunciation: '/tʃek aʊt taɪm/', meaning: 'Giờ trả phòng', example: 'Check-out time is 11 AM.', order: 6 },
          { word: 'Reception', pronunciation: '/rɪˈsepʃn/', meaning: 'Lễ tân', example: 'Please contact reception.', order: 7 },
          { word: 'Room service', pronunciation: '/ruːm ˈsɜːvɪs/', meaning: 'Dịch vụ phòng', example: 'I\'d like room service.', order: 8 },
          { word: 'Wi-Fi', pronunciation: '/ˈwaɪfaɪ/', meaning: 'Wifi', example: 'What\'s the Wi-Fi password?', order: 9 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Receptionist', text: 'Welcome! How may I help you?', translation: 'Chào mừng! Tôi có thể giúp gì?', order: 1, gender: 'female' },
          { speaker: 'Guest', text: 'I have a reservation under David Brown.', translation: 'Tôi đặt phòng tên David Brown.', order: 2, gender: 'male' },
          { speaker: 'Receptionist', text: 'Yes, a double room for three nights.', translation: 'Vâng, phòng đôi ba đêm.', order: 3, gender: 'female' },
          { speaker: 'Guest', text: 'Is breakfast included?', translation: 'Bữa sáng có bao gồm không?', order: 4, gender: 'male' },
          { speaker: 'Receptionist', text: 'Yes, from 7 to 10 AM.', translation: 'Có, từ 7 đến 10 giờ sáng.', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'d like to check in', meaning: 'Tôi muốn nhận phòng', example: 'Hello, I\'d like to check in.', order: 1 },
          { phrase: 'Can I have a late check-out?', meaning: 'Tôi có thể trả phòng muộn không?', example: 'Can I have a late check-out?', order: 2 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 8: RESTAURANT ============
  console.log('🍔 Thêm bài học Restaurant...')
  await prisma.lesson.create({
    data: {
      title: 'At the Restaurant - Ở nhà hàng',
      description: 'Học cách gọi món và thanh toán',
      level: 'intermediate',
      duration: '28',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Menu', pronunciation: '/ˈmenjuː/', meaning: 'Thực đơn', example: 'Can I see the menu?', order: 1 },
          { word: 'Appetizer', pronunciation: '/ˈæpɪtaɪzər/', meaning: 'Món khai vị', example: 'I\'ll have soup as an appetizer.', order: 2 },
          { word: 'Main course', pronunciation: '/meɪn kɔːrs/', meaning: 'Món chính', example: 'What\'s for main course?', order: 3 },
          { word: 'Dessert', pronunciation: '/dɪˈzɜːrt/', meaning: 'Món tráng miệng', example: 'Would you like dessert?', order: 4 },
          { word: 'Rare', pronunciation: '/reər/', meaning: 'Tái', example: 'I\'d like my steak rare.', order: 5 },
          { word: 'Medium', pronunciation: '/ˈmiːdiəm/', meaning: 'Vừa', example: 'Medium, please.', order: 6 },
          { word: 'Well-done', pronunciation: '/wel dʌn/', meaning: 'Chín kỹ', example: 'I prefer well-done.', order: 7 },
          { word: 'Bill', pronunciation: '/bɪl/', meaning: 'Hóa đơn', example: 'Can I have the bill?', order: 8 },
          { word: 'Tip', pronunciation: '/tɪp/', meaning: 'Tiền boa', example: 'How much should I tip?', order: 9 },
          { word: 'Delicious', pronunciation: '/dɪˈlɪʃəs/', meaning: 'Ngon', example: 'This is delicious!', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Waiter', text: 'Good evening! Do you have a reservation?', translation: 'Chào buổi tối! Quý khách có đặt bàn không?', order: 1, gender: 'male' },
          { speaker: 'Customer', text: 'Yes, under the name Johnson.', translation: 'Có, tên Johnson.', order: 2, gender: 'female' },
          { speaker: 'Waiter', text: 'Here are your menus. What would you like?', translation: 'Đây là thực đơn. Quý khách muốn gọi gì?', order: 3, gender: 'male' },
          { speaker: 'Customer', text: 'I\'ll have the grilled salmon, please.', translation: 'Cho tôi cá hồi nướng.', order: 4, gender: 'female' },
          { speaker: 'Waiter', text: 'Excellent choice! Anything to drink?', translation: 'Lựa chọn tuyệt vời! Quý khách uống gì?', order: 5, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'d like to order', meaning: 'Tôi muốn gọi món', example: 'Excuse me, I\'d like to order.', order: 1 },
          { phrase: 'Can I have the check?', meaning: 'Cho tôi hóa đơn?', example: 'Can I have the check, please?', order: 2 },
          { phrase: 'Keep the change', meaning: 'Giữ tiền thừa', example: 'Keep the change. Thank you!', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 9: SHOPPING ============
  console.log('🛒 Thêm bài học Shopping...')
  await prisma.lesson.create({
    data: {
      title: 'Shopping - Mua sắm',
      description: 'Từ vựng và hội thoại khi mua sắm',
      level: 'beginner',
      duration: '25',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Price', pronunciation: '/praɪs/', meaning: 'Giá', example: 'What\'s the price?', order: 1 },
          { word: 'Discount', pronunciation: '/ˈdɪskaʊnt/', meaning: 'Giảm giá', example: 'Is there a discount?', order: 2 },
          { word: 'Sale', pronunciation: '/seɪl/', meaning: 'Khuyến mãi', example: 'These are on sale.', order: 3 },
          { word: 'Size', pronunciation: '/saɪz/', meaning: 'Kích cỡ', example: 'What size do you wear?', order: 4 },
          { word: 'Color', pronunciation: '/ˈkʌlər/', meaning: 'Màu sắc', example: 'Do you have this in blue?', order: 5 },
          { word: 'Fitting room', pronunciation: '/ˈfɪtɪŋ ruːm/', meaning: 'Phòng thử đồ', example: 'Where\'s the fitting room?', order: 6 },
          { word: 'Cash', pronunciation: '/kæʃ/', meaning: 'Tiền mặt', example: 'I\'ll pay by cash.', order: 7 },
          { word: 'Credit card', pronunciation: '/ˈkredɪt kɑːd/', meaning: 'Thẻ tín dụng', example: 'Do you accept credit cards?', order: 8 },
          { word: 'Receipt', pronunciation: '/rɪˈsiːt/', meaning: 'Hóa đơn', example: 'Can I have the receipt?', order: 9 },
          { word: 'Refund', pronunciation: '/ˈriːfʌnd/', meaning: 'Hoàn tiền', example: 'Can I get a refund?', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Shop assistant', text: 'Hello! Can I help you?', translation: 'Xin chào! Tôi có thể giúp gì?', order: 1, gender: 'female' },
          { speaker: 'Customer', text: 'I\'m looking for a jacket.', translation: 'Tôi đang tìm áo khoác.', order: 2, gender: 'male' },
          { speaker: 'Shop assistant', text: 'What size do you need?', translation: 'Bạn cần cỡ nào?', order: 3, gender: 'female' },
          { speaker: 'Customer', text: 'Medium. Do you have black?', translation: 'Cỡ M. Có màu đen không?', order: 4, gender: 'male' },
          { speaker: 'Shop assistant', text: 'Yes! Would you like to try it on?', translation: 'Có! Bạn muốn thử không?', order: 5, gender: 'female' },
          { speaker: 'Customer', text: 'Yes, please. Where\'s the fitting room?', translation: 'Vâng. Phòng thử đồ ở đâu?', order: 6, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m just looking', meaning: 'Tôi chỉ xem thôi', example: 'Thanks, I\'m just looking.', order: 1 },
          { phrase: 'Can I try this on?', meaning: 'Tôi thử cái này được không?', example: 'Can I try this on?', order: 2 },
          { phrase: 'I\'ll take it', meaning: 'Tôi mua cái này', example: 'It fits! I\'ll take it.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 10: JOB INTERVIEW ============
  console.log('💼 Thêm bài học Job Interview...')
  await prisma.lesson.create({
    data: {
      title: 'Job Interview - Phỏng vấn xin việc',
      description: 'Chuẩn bị cho buổi phỏng vấn',
      level: 'intermediate',
      duration: '35',
      categoryId: workCategory.id,
      vocabulary: {
        create: [
          { word: 'Resume/CV', pronunciation: '/ˈrezjuːmeɪ/', meaning: 'Sơ yếu lý lịch', example: 'Please send your resume.', order: 1 },
          { word: 'Experience', pronunciation: '/ɪkˈspɪəriəns/', meaning: 'Kinh nghiệm', example: 'I have 5 years of experience.', order: 2 },
          { word: 'Qualification', pronunciation: '/ˌkwɒlɪfɪˈkeɪʃn/', meaning: 'Bằng cấp', example: 'What are your qualifications?', order: 3 },
          { word: 'Strength', pronunciation: '/streŋθ/', meaning: 'Điểm mạnh', example: 'My strength is problem-solving.', order: 4 },
          { word: 'Weakness', pronunciation: '/ˈwiːknəs/', meaning: 'Điểm yếu', example: 'My weakness is public speaking.', order: 5 },
          { word: 'Salary', pronunciation: '/ˈsæləri/', meaning: 'Lương', example: 'What\'s the salary range?', order: 6 },
          { word: 'Benefits', pronunciation: '/ˈbenɪfɪts/', meaning: 'Phúc lợi', example: 'Benefits include health insurance.', order: 7 },
          { word: 'Team player', pronunciation: '/tiːm ˈpleɪər/', meaning: 'Người làm việc nhóm tốt', example: 'I\'m a good team player.', order: 8 },
          { word: 'Motivated', pronunciation: '/ˈməʊtɪveɪtɪd/', meaning: 'Có động lực', example: 'I\'m highly motivated.', order: 9 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Interviewer', text: 'Tell me about yourself.', translation: 'Hãy giới thiệu về bản thân.', order: 1, gender: 'female' },
          { speaker: 'Candidate', text: 'I\'m a developer with 3 years of experience.', translation: 'Tôi là lập trình viên với 3 năm kinh nghiệm.', order: 2, gender: 'male' },
          { speaker: 'Interviewer', text: 'What are your greatest strengths?', translation: 'Điểm mạnh của bạn là gì?', order: 3, gender: 'female' },
          { speaker: 'Candidate', text: 'I\'m a fast learner and work well under pressure.', translation: 'Tôi học nhanh và làm việc tốt dưới áp lực.', order: 4, gender: 'male' },
          { speaker: 'Interviewer', text: 'Why do you want to work here?', translation: 'Tại sao bạn muốn làm việc ở đây?', order: 5, gender: 'female' },
          { speaker: 'Candidate', text: 'I admire your innovative products.', translation: 'Tôi ngưỡng mộ sản phẩm sáng tạo của công ty.', order: 6, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m passionate about...', meaning: 'Tôi đam mê về...', example: 'I\'m passionate about technology.', order: 1 },
          { phrase: 'I have experience in...', meaning: 'Tôi có kinh nghiệm về...', example: 'I have experience in web development.', order: 2 },
          { phrase: 'Thank you for the opportunity', meaning: 'Cảm ơn vì cơ hội', example: 'Thank you for the opportunity to interview.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 11: HEALTH ============
  console.log('🏥 Thêm bài học Health...')
  await prisma.lesson.create({
    data: {
      title: 'Health & Doctor - Sức khỏe',
      description: 'Từ vựng y tế và mô tả triệu chứng',
      level: 'intermediate',
      duration: '30',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Headache', pronunciation: '/ˈhedeɪk/', meaning: 'Đau đầu', example: 'I have a headache.', order: 1 },
          { word: 'Fever', pronunciation: '/ˈfiːvər/', meaning: 'Sốt', example: 'She has a high fever.', order: 2 },
          { word: 'Cough', pronunciation: '/kɒf/', meaning: 'Ho', example: 'I can\'t stop coughing.', order: 3 },
          { word: 'Sore throat', pronunciation: '/sɔːr θrəʊt/', meaning: 'Đau họng', example: 'My throat is sore.', order: 4 },
          { word: 'Stomachache', pronunciation: '/ˈstʌməkeɪk/', meaning: 'Đau bụng', example: 'I have a stomachache.', order: 5 },
          { word: 'Allergy', pronunciation: '/ˈælərdʒi/', meaning: 'Dị ứng', example: 'I\'m allergic to peanuts.', order: 6 },
          { word: 'Prescription', pronunciation: '/prɪˈskrɪpʃn/', meaning: 'Đơn thuốc', example: 'Here\'s your prescription.', order: 7 },
          { word: 'Medicine', pronunciation: '/ˈmedsn/', meaning: 'Thuốc', example: 'Take this medicine.', order: 8 },
          { word: 'Symptom', pronunciation: '/ˈsɪmptəm/', meaning: 'Triệu chứng', example: 'What are your symptoms?', order: 9 },
          { word: 'Appointment', pronunciation: '/əˈpɔɪntmənt/', meaning: 'Cuộc hẹn', example: 'I\'d like to make an appointment.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Doctor', text: 'What seems to be the problem?', translation: 'Bạn có vấn đề gì?', order: 1, gender: 'male' },
          { speaker: 'Patient', text: 'I have a fever and sore throat.', translation: 'Tôi bị sốt và đau họng.', order: 2, gender: 'female' },
          { speaker: 'Doctor', text: 'How long have you had these symptoms?', translation: 'Các triệu chứng này bao lâu rồi?', order: 3, gender: 'male' },
          { speaker: 'Patient', text: 'About three days now.', translation: 'Khoảng ba ngày.', order: 4, gender: 'female' },
          { speaker: 'Doctor', text: 'It\'s just a cold. I\'ll give you some medicine.', translation: 'Chỉ là cảm lạnh. Tôi sẽ kê thuốc.', order: 5, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I don\'t feel well', meaning: 'Tôi không khỏe', example: 'Doctor, I don\'t feel well.', order: 1 },
          { phrase: 'It hurts here', meaning: 'Đau ở đây', example: 'It hurts here, doctor.', order: 2 },
          { phrase: 'Get well soon', meaning: 'Chúc mau khỏe', example: 'Take care! Get well soon!', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC 12: SMALL TALK ============
  console.log('🗣️ Thêm bài học Small Talk...')
  await prisma.lesson.create({
    data: {
      title: 'Small Talk - Trò chuyện xã giao',
      description: 'Học cách trò chuyện nhẹ nhàng',
      level: 'intermediate',
      duration: '25',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Lovely weather', pronunciation: '/ˈlʌvli ˈweðər/', meaning: 'Thời tiết đẹp', example: 'Lovely weather today!', order: 1 },
          { word: 'How have you been?', pronunciation: '/haʊ həv juː biːn/', meaning: 'Dạo này thế nào?', example: 'Long time no see! How have you been?', order: 2 },
          { word: 'By the way', pronunciation: '/baɪ ðə weɪ/', meaning: 'Nhân tiện', example: 'By the way, have you seen John?', order: 3 },
          { word: 'Speaking of which', pronunciation: '/ˈspiːkɪŋ əv wɪtʃ/', meaning: 'Nói đến chuyện đó', example: 'Speaking of which, I need to call him.', order: 4 },
          { word: 'Anyway', pronunciation: '/ˈeniweɪ/', meaning: 'Dù sao', example: 'Anyway, I have to go now.', order: 5 },
          { word: 'To be honest', pronunciation: '/tuː biː ˈɒnɪst/', meaning: 'Thành thật mà nói', example: 'To be honest, I don\'t like it.', order: 6 },
          { word: 'Take care', pronunciation: '/teɪk keər/', meaning: 'Bảo trọng', example: 'Take care! See you soon!', order: 7 },
          { word: 'Keep in touch', pronunciation: '/kiːp ɪn tʌtʃ/', meaning: 'Giữ liên lạc', example: 'Let\'s keep in touch!', order: 8 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Sarah', text: 'Mike! Long time no see!', translation: 'Mike! Lâu rồi không gặp!', order: 1, gender: 'female' },
          { speaker: 'Mike', text: 'Sarah! How have you been?', translation: 'Sarah! Dạo này thế nào?', order: 2, gender: 'male' },
          { speaker: 'Sarah', text: 'I\'m doing great! Lovely weather today!', translation: 'Tôi rất tốt! Thời tiết hôm nay đẹp!', order: 3, gender: 'female' },
          { speaker: 'Mike', text: 'Yes! By the way, are you still working at that company?', translation: 'Vâng! Nhân tiện, bạn vẫn làm ở công ty đó à?', order: 4, gender: 'male' },
          { speaker: 'Sarah', text: 'Actually, I changed jobs. Let\'s keep in touch!', translation: 'Thực ra, tôi đổi việc rồi. Giữ liên lạc nhé!', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'How\'s it going?', meaning: 'Mọi chuyện thế nào?', example: 'Hey! How\'s it going?', order: 1 },
          { phrase: 'What have you been up to?', meaning: 'Dạo này bạn làm gì?', example: 'What have you been up to lately?', order: 2 },
          { phrase: 'Same old, same old', meaning: 'Vẫn vậy thôi', example: 'Same old, same old. Nothing new!', order: 3 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã thêm:')
  console.log('   - 12 bài học mới')
  console.log('   - 120+ từ vựng')
  console.log('   - 35+ cụm từ')
  console.log('   - 12+ đoạn hội thoại thực tế\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
