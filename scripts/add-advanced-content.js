const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Thêm nội dung nâng cao và idioms...\n')

  // Đảm bảo có categories
  const advancedCategory = await prisma.category.upsert({
    where: { name: 'advanced' },
    update: {},
    create: {
      name: 'advanced',
      description: 'Bài học nâng cao cho người học tiếng Anh',
      icon: '🎓'
    }
  })

  const dailyCategory = await prisma.category.upsert({
    where: { name: 'daily' },
    update: {},
    create: {
      name: 'daily',
      description: 'Các tình huống giao tiếp thường gặp',
      icon: '💬'
    }
  })

  console.log('💡 Thêm bài học Idioms và Phrasal Verbs...')

  const idiomsLesson = await prisma.lesson.create({
    data: {
      title: 'Common English Idioms - Thành ngữ tiếng Anh thông dụng',
      description: 'Học các thành ngữ và cách diễn đạt thường gặp trong tiếng Anh',
      level: 'advanced',
      duration: '35',
      categoryId: advancedCategory.id,
      vocabulary: {
        create: [
          { word: 'Break the ice', pronunciation: '/breɪk ði aɪs/', meaning: 'Phá vỡ sự ngượng ngùng', example: 'Tell a joke to break the ice.', order: 1 },
          { word: 'Piece of cake', pronunciation: '/piːs əv keɪk/', meaning: 'Dễ như ăn bánh', example: 'The test was a piece of cake.', order: 2 },
          { word: 'Hit the nail on the head', pronunciation: '/hɪt ðə neɪl ɒn ðə hed/', meaning: 'Nói đúng trọng tâm', example: 'You hit the nail on the head with that comment.', order: 3 },
          { word: 'Once in a blue moon', pronunciation: '/wʌns ɪn ə bluː muːn/', meaning: 'Hiếm khi, rất ít khi', example: 'I see him once in a blue moon.', order: 4 },
          { word: 'Cost an arm and a leg', pronunciation: '/kɒst ən ɑːm ənd ə leɡ/', meaning: 'Rất đắt', example: 'That car costs an arm and a leg.', order: 5 },
          { word: 'Under the weather', pronunciation: '/ˈʌndər ðə ˈweðər/', meaning: 'Không khỏe', example: 'I\'m feeling under the weather today.', order: 6 },
          { word: 'Spill the beans', pronunciation: '/spɪl ðə biːnz/', meaning: 'Tiết lộ bí mật', example: 'Don\'t spill the beans about the party.', order: 7 },
          { word: 'Let the cat out of the bag', pronunciation: '/let ðə kæt aʊt əv ðə bæɡ/', meaning: 'Để lộ bí mật', example: 'She let the cat out of the bag accidentally.', order: 8 },
          { word: 'Burn the midnight oil', pronunciation: '/bɜːn ðə ˈmɪdnaɪt ɔɪl/', meaning: 'Thức khuya làm việc', example: 'I\'m burning the midnight oil to finish this project.', order: 9 },
          { word: 'The ball is in your court', pronunciation: '/ðə bɔːl ɪz ɪn jɔːr kɔːrt/', meaning: 'Quyết định thuộc về bạn', example: 'I\'ve made my offer. The ball is in your court.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'It\'s raining cats and dogs', meaning: 'Mưa to như trút nước', usage: 'Describing heavy rain', order: 1 },
          { phrase: 'Barking up the wrong tree', meaning: 'Đi sai hướng, nhầm đối tượng', usage: 'Making a mistake', order: 2 },
          { phrase: 'Beat around the bush', meaning: 'Nói vòng vo', usage: 'Not being direct', order: 3 },
          { phrase: 'Cut to the chase', meaning: 'Nói thẳng vào vấn đề', usage: 'Getting to the point', order: 4 },
          { phrase: 'Actions speak louder than words', meaning: 'Hành động quan trọng hơn lời nói', usage: 'Advice about behavior', order: 5 },
        ]
      }
    }
  })

  console.log('🎯 Thêm bài học Phrasal Verbs...')

  const phrasalVerbsLesson = await prisma.lesson.create({
    data: {
      title: 'Essential Phrasal Verbs - Cụm động từ thiết yếu',
      description: 'Tìm hiểu các cụm động từ quan trọng và cách sử dụng',
      level: 'intermediate',
      duration: '30',
      categoryId: advancedCategory.id,
      vocabulary: {
        create: [
          { word: 'Look up', pronunciation: '/lʊk ʌp/', meaning: 'Tra cứu', example: 'Look up the word in the dictionary.', order: 1 },
          { word: 'Give up', pronunciation: '/ɡɪv ʌp/', meaning: 'Từ bỏ', example: 'Don\'t give up on your dreams.', order: 2 },
          { word: 'Turn down', pronunciation: '/tɜːn daʊn/', meaning: 'Từ chối', example: 'She turned down the job offer.', order: 3 },
          { word: 'Put off', pronunciation: '/pʊt ɒf/', meaning: 'Hoãn lại', example: 'Let\'s put off the meeting until tomorrow.', order: 4 },
          { word: 'Break down', pronunciation: '/breɪk daʊn/', meaning: 'Hỏng, hư', example: 'My car broke down on the highway.', order: 5 },
          { word: 'Carry on', pronunciation: '/ˈkæri ɒn/', meaning: 'Tiếp tục', example: 'Please carry on with your work.', order: 6 },
          { word: 'Come across', pronunciation: '/kʌm əˈkrɒs/', meaning: 'Tình cờ gặp', example: 'I came across an old friend yesterday.', order: 7 },
          { word: 'Figure out', pronunciation: '/ˈfɪɡər aʊt/', meaning: 'Tìm ra, hiểu ra', example: 'I can\'t figure out this puzzle.', order: 8 },
          { word: 'Get along', pronunciation: '/ɡet əˈlɒŋ/', meaning: 'Hòa hợp', example: 'We get along really well.', order: 9 },
          { word: 'Show up', pronunciation: '/ʃəʊ ʌp/', meaning: 'Xuất hiện', example: 'He didn\'t show up to the meeting.', order: 10 },
          { word: 'Take off', pronunciation: '/teɪk ɒf/', meaning: 'Cất cánh; cởi ra', example: 'The plane will take off soon.', order: 11 },
          { word: 'Run into', pronunciation: '/rʌn ˈɪntuː/', meaning: 'Tình cờ gặp', example: 'I ran into an old classmate.', order: 12 },
          { word: 'Bring up', pronunciation: '/brɪŋ ʌp/', meaning: 'Đưa ra (chủ đề)', example: 'Don\'t bring up that topic.', order: 13 },
          { word: 'Look forward to', pronunciation: '/lʊk ˈfɔːrwərd tuː/', meaning: 'Mong đợi', example: 'I look forward to seeing you.', order: 14 },
          { word: 'Call off', pronunciation: '/kɔːl ɒf/', meaning: 'Hủy bỏ', example: 'They called off the wedding.', order: 15 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Pick up the pace', meaning: 'Tăng tốc độ', usage: 'Working faster', order: 1 },
          { phrase: 'Catch up with', meaning: 'Theo kịp, gặp gỡ', usage: 'Meeting someone', order: 2 },
          { phrase: 'Get over something', meaning: 'Vượt qua điều gì', usage: 'Recovering from difficulty', order: 3 },
          { phrase: 'Make up your mind', meaning: 'Quyết định', usage: 'Making a decision', order: 4 },
        ]
      }
    }
  })

  console.log('🗣️ Thêm bài học Small Talk...')

  const smallTalkLesson = await prisma.lesson.create({
    data: {
      title: 'Small Talk - Trò chuyện xã giao',
      description: 'Học cách trò chuyện nhẹ nhàng trong các tình huống xã giao',
      level: 'intermediate',
      duration: '25',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Lovely weather', pronunciation: '/ˈlʌvli ˈweðər/', meaning: 'Thời tiết đẹp', example: 'Lovely weather today, isn\'t it?', order: 1 },
          { word: 'How have you been?', pronunciation: '/haʊ həv juː biːn/', meaning: 'Dạo này thế nào?', example: 'Long time no see! How have you been?', order: 2 },
          { word: 'Catch up', pronunciation: '/kætʃ ʌp/', meaning: 'Gặp gỡ để trò chuyện', example: 'Let\'s catch up over coffee.', order: 3 },
          { word: 'By the way', pronunciation: '/baɪ ðə weɪ/', meaning: 'Nhân tiện', example: 'By the way, have you seen John?', order: 4 },
          { word: 'Speaking of which', pronunciation: '/ˈspiːkɪŋ əv wɪtʃ/', meaning: 'Nói đến chuyện đó', example: 'Speaking of which, I need to call him.', order: 5 },
          { word: 'Anyway', pronunciation: '/ˈeniweɪ/', meaning: 'Dù sao', example: 'Anyway, I have to go now.', order: 6 },
          { word: 'I suppose', pronunciation: '/aɪ səˈpəʊz/', meaning: 'Tôi cho là', example: 'I suppose you\'re right.', order: 7 },
          { word: 'To be honest', pronunciation: '/tuː biː ˈɒnɪst/', meaning: 'Thành thật mà nói', example: 'To be honest, I don\'t like it.', order: 8 },
          { word: 'Take care', pronunciation: '/teɪk keər/', meaning: 'Bảo trọng', example: 'Nice talking to you. Take care!', order: 9 },
          { word: 'Keep in touch', pronunciation: '/kiːp ɪn tʌtʃ/', meaning: 'Giữ liên lạc', example: 'Let\'s keep in touch!', order: 10 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Meeting an old friend',
            participants: ['Sarah', 'Mike'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Sarah', text: 'Mike! Long time no see! How have you been?', translation: 'Mike! Lâu rồi không gặp! Dạo này thế nào?', order: 1, gender: 'female' },
                { speaker: 'Mike', text: 'Sarah! I\'m doing great! How about you?', translation: 'Sarah! Tôi rất tốt! Còn bạn thế nào?', order: 2, gender: 'male' },
                { speaker: 'Sarah', text: 'Can\'t complain. Lovely weather today, isn\'t it?', translation: 'Không phàn nàn gì. Thời tiết hôm nay đẹp nhỉ?', order: 3, gender: 'female' },
                { speaker: 'Mike', text: 'Absolutely! By the way, are you still working at the tech company?', translation: 'Chắc chắn rồi! Nhân tiện, bạn vẫn đang làm ở công ty công nghệ à?', order: 4, gender: 'male' },
                { speaker: 'Sarah', text: 'Actually, I changed jobs last month. I\'m at a startup now.', translation: 'Thực ra, tôi đổi việc tháng trước. Giờ tôi ở một công ty khởi nghiệp.', order: 5, gender: 'female' },
                { speaker: 'Mike', text: 'That sounds exciting! We should catch up properly sometime.', translation: 'Nghe thú vị đấy! Chúng ta nên gặp nhau trò chuyện kỹ lúc nào đó.', order: 6, gender: 'male' },
                { speaker: 'Sarah', text: 'Definitely! Let\'s keep in touch.', translation: 'Chắc chắn rồi! Giữ liên lạc nhé.', order: 7, gender: 'female' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'How\'s it going?', meaning: 'Mọi chuyện thế nào?', usage: 'Casual greeting', order: 1 },
          { phrase: 'What have you been up to?', meaning: 'Dạo này bạn làm gì?', usage: 'Asking about activities', order: 2 },
          { phrase: 'Same old, same old', meaning: 'Vẫn vậy thôi', usage: 'Responding to "how are you"', order: 3 },
          { phrase: 'I hear you', meaning: 'Tôi hiểu', usage: 'Showing understanding', order: 4 },
        ]
      }
    }
  })

  console.log('🎓 Thêm bài học Academic English...')

  const academicLesson = await prisma.lesson.create({
    data: {
      title: 'Academic Vocabulary - Từ vựng học thuật',
      description: 'Từ vựng cần thiết cho bài viết và trình bày học thuật',
      level: 'advanced',
      duration: '40',
      categoryId: advancedCategory.id,
      vocabulary: {
        create: [
          { word: 'Analyze', pronunciation: '/ˈænəlaɪz/', meaning: 'Phân tích', example: 'We need to analyze the data carefully.', order: 1 },
          { word: 'Hypothesis', pronunciation: '/haɪˈpɒθəsɪs/', meaning: 'Giả thuyết', example: 'Our hypothesis was proven correct.', order: 2 },
          { word: 'Methodology', pronunciation: '/ˌmeθəˈdɒlədʒi/', meaning: 'Phương pháp luận', example: 'The methodology section explains our approach.', order: 3 },
          { word: 'Comprehensive', pronunciation: '/ˌkɒmprɪˈhensɪv/', meaning: 'Toàn diện', example: 'A comprehensive review of the literature.', order: 4 },
          { word: 'Significant', pronunciation: '/sɪɡˈnɪfɪkənt/', meaning: 'Quan trọng, đáng kể', example: 'The results show significant improvement.', order: 5 },
          { word: 'Furthermore', pronunciation: '/ˈfɜːðəmɔːr/', meaning: 'Hơn nữa', example: 'Furthermore, the study reveals...', order: 6 },
          { word: 'Nevertheless', pronunciation: '/ˌnevəðəˈles/', meaning: 'Tuy nhiên', example: 'Nevertheless, we must consider...', order: 7 },
          { word: 'Consequently', pronunciation: '/ˈkɒnsɪkwəntli/', meaning: 'Do đó', example: 'Consequently, we can conclude that...', order: 8 },
          { word: 'Paradigm', pronunciation: '/ˈpærədaɪm/', meaning: 'Mô hình, khuôn mẫu', example: 'A new paradigm in research.', order: 9 },
          { word: 'Empirical', pronunciation: '/ɪmˈpɪrɪkl/', meaning: 'Thực nghiệm', example: 'Empirical evidence supports this theory.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'In light of', meaning: 'Xét đến', usage: 'Considering something', order: 1 },
          { phrase: 'It is worth noting that', meaning: 'Đáng chú ý rằng', usage: 'Highlighting important point', order: 2 },
          { phrase: 'To a certain extent', meaning: 'Ở một mức độ nhất định', usage: 'Partially agreeing', order: 3 },
          { phrase: 'On the contrary', meaning: 'Ngược lại', usage: 'Contrasting ideas', order: 4 },
        ]
      }
    }
  })

  console.log('🍔 Thêm bài học Restaurant Conversations...')

  const restaurantLesson = await prisma.lesson.create({
    data: {
      title: 'At the Restaurant - Ở nhà hàng',
      description: 'Học cách đặt bàn, gọi món và thanh toán tại nhà hàng',
      level: 'intermediate',
      duration: '28',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezəˈveɪʃn/', meaning: 'Đặt bàn', example: 'I\'d like to make a reservation for two.', order: 1 },
          { word: 'Menu', pronunciation: '/ˈmenjuː/', meaning: 'Thực đơn', example: 'Can I see the menu, please?', order: 2 },
          { word: 'Appetizer', pronunciation: '/ˈæpɪtaɪzər/', meaning: 'Món khai vị', example: 'I\'ll have the soup as an appetizer.', order: 3 },
          { word: 'Main course', pronunciation: '/meɪn kɔːrs/', meaning: 'Món chính', example: 'What would you like for the main course?', order: 4 },
          { word: 'Dessert', pronunciation: '/dɪˈzɜːrt/', meaning: 'Món tráng miệng', example: 'Would you like dessert?', order: 5 },
          { word: 'Rare', pronunciation: '/reər/', meaning: 'Tái (độ chín thịt)', example: 'I\'d like my steak rare.', order: 6 },
          { word: 'Medium', pronunciation: '/ˈmiːdiəm/', meaning: 'Vừa (độ chín)', example: 'Medium, please.', order: 7 },
          { word: 'Well-done', pronunciation: '/wel dʌn/', meaning: 'Chín kỹ', example: 'I prefer my meat well-done.', order: 8 },
          { word: 'Check/Bill', pronunciation: '/tʃek/bɪl/', meaning: 'Hóa đơn', example: 'Can we have the check, please?', order: 9 },
          { word: 'Tip', pronunciation: '/tɪp/', meaning: 'Tiền boa', example: 'How much should I tip?', order: 10 },
          { word: 'Delicious', pronunciation: '/dɪˈlɪʃəs/', meaning: 'Ngon', example: 'This meal is delicious!', order: 11 },
          { word: 'Spicy', pronunciation: '/ˈspaɪsi/', meaning: 'Cay', example: 'Is this dish spicy?', order: 12 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Ordering at a restaurant',
            participants: ['Waiter', 'Customer'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Waiter', text: 'Good evening! Do you have a reservation?', translation: 'Chào buổi tối! Quý khách có đặt bàn không?', order: 1, gender: 'male' },
                { speaker: 'Customer', text: 'Yes, under the name Johnson for two people.', translation: 'Có, dưới tên Johnson cho hai người.', order: 2, gender: 'female' },
                { speaker: 'Waiter', text: 'Perfect! Right this way. Here are your menus.', translation: 'Hoàn hảo! Đi lối này. Đây là thực đơn của quý khách.', order: 3, gender: 'male' },
                { speaker: 'Customer', text: 'Thank you. What do you recommend?', translation: 'Cảm ơn. Bạn gợi ý món gì?', order: 4, gender: 'female' },
                { speaker: 'Waiter', text: 'Our grilled salmon is excellent today.', translation: 'Cá hồi nướng của chúng tôi hôm nay rất tuyệt.', order: 5, gender: 'male' },
                { speaker: 'Customer', text: 'Sounds good! I\'ll have that, please.', translation: 'Nghe hay đấy! Cho tôi món đó.', order: 6, gender: 'female' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'d like to order', meaning: 'Tôi muốn gọi món', usage: 'Starting order', order: 1 },
          { phrase: 'How would you like it cooked?', meaning: 'Bạn muốn nấu như thế nào?', usage: 'Asking about preference', order: 2 },
          { phrase: 'Can I have the check?', meaning: 'Cho tôi xin hóa đơn?', usage: 'Requesting bill', order: 3 },
          { phrase: 'Keep the change', meaning: 'Giữ phần tiền thừa', usage: 'Giving tip', order: 4 },
        ]
      }
    }
  })

  // ============ THÊM BÀI HỌC MỚI ============

  const beginnerCategory = await prisma.category.upsert({
    where: { name: 'beginner' },
    update: {},
    create: {
      name: 'beginner',
      description: 'Dành cho người mới bắt đầu',
      icon: '🌱'
    }
  })

  const travelCategory = await prisma.category.upsert({
    where: { name: 'travel' },
    update: {},
    create: {
      name: 'travel',
      description: 'Tiếng Anh du lịch',
      icon: '✈️'
    }
  })

  const workCategory = await prisma.category.upsert({
    where: { name: 'work' },
    update: {},
    create: {
      name: 'work',
      description: 'Tiếng Anh công việc',
      icon: '💼'
    }
  })

  console.log('🌱 Thêm bài học Greetings...')

  await prisma.lesson.create({
    data: {
      title: 'Greetings & Introductions - Chào hỏi và Giới thiệu',
      description: 'Học cách chào hỏi và giới thiệu bản thân trong tiếng Anh',
      level: 'beginner',
      duration: '20',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'Hello', pronunciation: '/həˈləʊ/', meaning: 'Xin chào', example: 'Hello! How are you?', order: 1 },
          { word: 'Good morning', pronunciation: '/ɡʊd ˈmɔːnɪŋ/', meaning: 'Chào buổi sáng', example: 'Good morning, everyone!', order: 2 },
          { word: 'Good afternoon', pronunciation: '/ɡʊd ˌɑːftəˈnuːn/', meaning: 'Chào buổi chiều', example: 'Good afternoon, sir.', order: 3 },
          { word: 'Good evening', pronunciation: '/ɡʊd ˈiːvnɪŋ/', meaning: 'Chào buổi tối', example: 'Good evening, welcome!', order: 4 },
          { word: 'Goodbye', pronunciation: '/ɡʊdˈbaɪ/', meaning: 'Tạm biệt', example: 'Goodbye! See you tomorrow.', order: 5 },
          { word: 'Nice to meet you', pronunciation: '/naɪs tuː miːt juː/', meaning: 'Rất vui được gặp bạn', example: 'Nice to meet you, Sarah!', order: 6 },
          { word: 'My name is...', pronunciation: '/maɪ neɪm ɪz/', meaning: 'Tên tôi là...', example: 'My name is John.', order: 7 },
          { word: 'I\'m from...', pronunciation: '/aɪm frɒm/', meaning: 'Tôi đến từ...', example: 'I\'m from Vietnam.', order: 8 },
          { word: 'How are you?', pronunciation: '/haʊ ɑːr juː/', meaning: 'Bạn khỏe không?', example: 'Hi! How are you today?', order: 9 },
          { word: 'I\'m fine', pronunciation: '/aɪm faɪn/', meaning: 'Tôi khỏe', example: 'I\'m fine, thank you!', order: 10 },
          { word: 'Thank you', pronunciation: '/θæŋk juː/', meaning: 'Cảm ơn', example: 'Thank you very much!', order: 11 },
          { word: 'You\'re welcome', pronunciation: '/jʊər ˈwelkəm/', meaning: 'Không có gì', example: 'You\'re welcome!', order: 12 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'First meeting',
            participants: ['Anna', 'Tom'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Anna', text: 'Hello! My name is Anna.', translation: 'Xin chào! Tên tôi là Anna.', order: 1, gender: 'female' },
                { speaker: 'Tom', text: 'Hi Anna! I\'m Tom. Nice to meet you!', translation: 'Chào Anna! Tôi là Tom. Rất vui được gặp bạn!', order: 2, gender: 'male' },
                { speaker: 'Anna', text: 'Nice to meet you too! Where are you from?', translation: 'Tôi cũng rất vui được gặp bạn! Bạn đến từ đâu?', order: 3, gender: 'female' },
                { speaker: 'Tom', text: 'I\'m from the United States. And you?', translation: 'Tôi đến từ Mỹ. Còn bạn?', order: 4, gender: 'male' },
                { speaker: 'Anna', text: 'I\'m from Vietnam. I live in Ho Chi Minh City.', translation: 'Tôi đến từ Việt Nam. Tôi sống ở Thành phố Hồ Chí Minh.', order: 5, gender: 'female' },
                { speaker: 'Tom', text: 'That\'s wonderful! How long have you been learning English?', translation: 'Tuyệt vời! Bạn học tiếng Anh được bao lâu rồi?', order: 6, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'What\'s your name?', meaning: 'Bạn tên gì?', usage: 'Asking someone\'s name', order: 1 },
          { phrase: 'How do you do?', meaning: 'Bạn khỏe không? (trang trọng)', usage: 'Formal greeting', order: 2 },
          { phrase: 'See you later', meaning: 'Hẹn gặp lại', usage: 'Casual goodbye', order: 3 },
          { phrase: 'Have a nice day', meaning: 'Chúc một ngày tốt lành', usage: 'Friendly farewell', order: 4 },
        ]
      }
    }
  })

  console.log('🔢 Thêm bài học Numbers & Time...')

  await prisma.lesson.create({
    data: {
      title: 'Numbers & Time - Số và Thời gian',
      description: 'Học số đếm, số thứ tự và cách nói giờ',
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
          { word: 'Thousand', pronunciation: '/ˈθaʊzənd/', meaning: 'Nghìn', example: 'It costs two thousand.', order: 7 },
          { word: 'First', pronunciation: '/fɜːst/', meaning: 'Thứ nhất', example: 'This is my first day.', order: 8 },
          { word: 'Second', pronunciation: '/ˈsekənd/', meaning: 'Thứ hai', example: 'Wait a second!', order: 9 },
          { word: 'Third', pronunciation: '/θɜːd/', meaning: 'Thứ ba', example: 'She came in third place.', order: 10 },
          { word: 'Hour', pronunciation: '/aʊər/', meaning: 'Giờ', example: 'It takes one hour.', order: 11 },
          { word: 'Minute', pronunciation: '/ˈmɪnɪt/', meaning: 'Phút', example: 'Give me five minutes.', order: 12 },
          { word: 'O\'clock', pronunciation: '/əˈklɒk/', meaning: 'Giờ đúng', example: 'It\'s three o\'clock.', order: 13 },
          { word: 'Half past', pronunciation: '/hɑːf pɑːst/', meaning: 'Rưỡi', example: 'It\'s half past two.', order: 14 },
          { word: 'Quarter', pronunciation: '/ˈkwɔːtər/', meaning: '15 phút', example: 'It\'s a quarter to five.', order: 15 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Asking about time',
            participants: ['Lisa', 'David'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Lisa', text: 'Excuse me, what time is it?', translation: 'Xin lỗi, bây giờ là mấy giờ?', order: 1, gender: 'female' },
                { speaker: 'David', text: 'It\'s half past nine.', translation: 'Bây giờ là 9 giờ rưỡi.', order: 2, gender: 'male' },
                { speaker: 'Lisa', text: 'Oh no! I\'m late for class. It starts at ten o\'clock.', translation: 'Ôi không! Tôi muộn học rồi. Lớp bắt đầu lúc 10 giờ.', order: 3, gender: 'female' },
                { speaker: 'David', text: 'Don\'t worry, you still have thirty minutes.', translation: 'Đừng lo, bạn vẫn còn 30 phút.', order: 4, gender: 'male' },
                { speaker: 'Lisa', text: 'Thank you! By the way, how much is this coffee?', translation: 'Cảm ơn! À này, cốc cà phê này giá bao nhiêu?', order: 5, gender: 'female' },
                { speaker: 'David', text: 'It\'s three dollars and fifty cents.', translation: 'Ba đô la năm mươi xu.', order: 6, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'What time is it?', meaning: 'Mấy giờ rồi?', usage: 'Asking about time', order: 1 },
          { phrase: 'How much is it?', meaning: 'Bao nhiêu tiền?', usage: 'Asking about price', order: 2 },
          { phrase: 'I\'m running late', meaning: 'Tôi đang bị muộn', usage: 'Being late', order: 3 },
        ]
      }
    }
  })

  console.log('👨‍👩‍👧‍👦 Thêm bài học Family...')

  await prisma.lesson.create({
    data: {
      title: 'Family Members - Thành viên gia đình',
      description: 'Học từ vựng về các thành viên trong gia đình',
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
          { word: 'Uncle', pronunciation: '/ˈʌŋkl/', meaning: 'Chú/bác/cậu', example: 'My uncle lives in Hanoi.', order: 7 },
          { word: 'Aunt', pronunciation: '/ɑːnt/', meaning: 'Cô/dì/thím', example: 'My aunt is very kind.', order: 8 },
          { word: 'Cousin', pronunciation: '/ˈkʌzn/', meaning: 'Anh/chị/em họ', example: 'I have many cousins.', order: 9 },
          { word: 'Husband', pronunciation: '/ˈhʌzbənd/', meaning: 'Chồng', example: 'Her husband is a doctor.', order: 10 },
          { word: 'Wife', pronunciation: '/waɪf/', meaning: 'Vợ', example: 'His wife is a nurse.', order: 11 },
          { word: 'Son', pronunciation: '/sʌn/', meaning: 'Con trai', example: 'Their son is five years old.', order: 12 },
          { word: 'Daughter', pronunciation: '/ˈdɔːtər/', meaning: 'Con gái', example: 'Our daughter loves music.', order: 13 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Talking about family',
            participants: ['Emma', 'Jack'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Emma', text: 'Do you have any brothers or sisters?', translation: 'Bạn có anh chị em không?', order: 1, gender: 'female' },
                { speaker: 'Jack', text: 'Yes, I have one older brother and two younger sisters.', translation: 'Có, tôi có một anh trai và hai em gái.', order: 2, gender: 'male' },
                { speaker: 'Emma', text: 'Wow, that\'s a big family! What does your brother do?', translation: 'Ôi, gia đình đông thế! Anh trai bạn làm nghề gì?', order: 3, gender: 'female' },
                { speaker: 'Jack', text: 'He\'s an engineer. He works at a tech company.', translation: 'Anh ấy là kỹ sư. Anh ấy làm việc ở công ty công nghệ.', order: 4, gender: 'male' },
                { speaker: 'Emma', text: 'That\'s great! Do you live with your parents?', translation: 'Tuyệt vời! Bạn có sống với bố mẹ không?', order: 5, gender: 'female' },
                { speaker: 'Jack', text: 'No, I live alone, but I visit them every weekend.', translation: 'Không, tôi sống một mình, nhưng tôi thăm họ mỗi cuối tuần.', order: 6, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'How many siblings do you have?', meaning: 'Bạn có bao nhiêu anh chị em?', usage: 'Asking about siblings', order: 1 },
          { phrase: 'I\'m the youngest/oldest', meaning: 'Tôi là út/cả', usage: 'Describing birth order', order: 2 },
          { phrase: 'We\'re a close family', meaning: 'Gia đình chúng tôi rất gắn bó', usage: 'Describing family relationship', order: 3 },
        ]
      }
    }
  })

  console.log('✈️ Thêm bài học Airport...')

  await prisma.lesson.create({
    data: {
      title: 'At the Airport - Ở sân bay',
      description: 'Từ vựng và hội thoại cần thiết khi đi máy bay',
      level: 'intermediate',
      duration: '30',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Boarding pass', pronunciation: '/ˈbɔːdɪŋ pɑːs/', meaning: 'Thẻ lên máy bay', example: 'Please show your boarding pass.', order: 1 },
          { word: 'Passport', pronunciation: '/ˈpɑːspɔːt/', meaning: 'Hộ chiếu', example: 'Don\'t forget your passport!', order: 2 },
          { word: 'Check-in', pronunciation: '/tʃek ɪn/', meaning: 'Làm thủ tục', example: 'Online check-in is available.', order: 3 },
          { word: 'Luggage', pronunciation: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý', example: 'My luggage is too heavy.', order: 4 },
          { word: 'Carry-on', pronunciation: '/ˈkæri ɒn/', meaning: 'Hành lý xách tay', example: 'You can bring one carry-on bag.', order: 5 },
          { word: 'Gate', pronunciation: '/ɡeɪt/', meaning: 'Cửa ra máy bay', example: 'The gate number is 15.', order: 6 },
          { word: 'Departure', pronunciation: '/dɪˈpɑːtʃər/', meaning: 'Khởi hành', example: 'Departure is at 8 AM.', order: 7 },
          { word: 'Arrival', pronunciation: '/əˈraɪvl/', meaning: 'Đến nơi', example: 'Expected arrival is 3 PM.', order: 8 },
          { word: 'Delay', pronunciation: '/dɪˈleɪ/', meaning: 'Trễ, hoãn', example: 'There\'s a two-hour delay.', order: 9 },
          { word: 'Security check', pronunciation: '/sɪˈkjʊərəti tʃek/', meaning: 'Kiểm tra an ninh', example: 'Please go through security check.', order: 10 },
          { word: 'Customs', pronunciation: '/ˈkʌstəmz/', meaning: 'Hải quan', example: 'Do you have anything to declare at customs?', order: 11 },
          { word: 'Window seat', pronunciation: '/ˈwɪndəʊ siːt/', meaning: 'Ghế cạnh cửa sổ', example: 'I prefer a window seat.', order: 12 },
          { word: 'Aisle seat', pronunciation: '/aɪl siːt/', meaning: 'Ghế cạnh lối đi', example: 'Can I have an aisle seat?', order: 13 },
          { word: 'Flight attendant', pronunciation: '/flaɪt əˈtendənt/', meaning: 'Tiếp viên hàng không', example: 'The flight attendant was very helpful.', order: 14 },
          { word: 'Turbulence', pronunciation: '/ˈtɜːbjʊləns/', meaning: 'Nhiễu động', example: 'Please fasten your seatbelts due to turbulence.', order: 15 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'At the check-in counter',
            participants: ['Staff', 'Passenger'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Staff', text: 'Good morning! May I see your passport and booking reference?', translation: 'Chào buổi sáng! Xin cho xem hộ chiếu và mã đặt chỗ?', order: 1, gender: 'female' },
                { speaker: 'Passenger', text: 'Here you are. I\'m flying to Singapore.', translation: 'Đây ạ. Tôi bay đi Singapore.', order: 2, gender: 'male' },
                { speaker: 'Staff', text: 'Do you have any luggage to check in?', translation: 'Anh có hành lý ký gửi không?', order: 3, gender: 'female' },
                { speaker: 'Passenger', text: 'Yes, one suitcase. And I have a carry-on bag.', translation: 'Có, một vali. Và tôi có một túi xách tay.', order: 4, gender: 'male' },
                { speaker: 'Staff', text: 'Would you prefer a window or aisle seat?', translation: 'Anh muốn ghế cạnh cửa sổ hay cạnh lối đi?', order: 5, gender: 'female' },
                { speaker: 'Passenger', text: 'Window seat, please.', translation: 'Ghế cạnh cửa sổ, cảm ơn.', order: 6, gender: 'male' },
                { speaker: 'Staff', text: 'Here\'s your boarding pass. Gate 12, boarding starts at 9:30.', translation: 'Đây là thẻ lên máy bay. Cửa 12, bắt đầu lên máy bay lúc 9:30.', order: 7, gender: 'female' },
                { speaker: 'Passenger', text: 'Thank you! Where is the security check?', translation: 'Cảm ơn! Khu kiểm tra an ninh ở đâu?', order: 8, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'What time does boarding start?', meaning: 'Mấy giờ bắt đầu lên máy bay?', usage: 'Asking about boarding', order: 1 },
          { phrase: 'Is my flight on time?', meaning: 'Chuyến bay của tôi có đúng giờ không?', usage: 'Checking flight status', order: 2 },
          { phrase: 'Where can I pick up my luggage?', meaning: 'Tôi lấy hành lý ở đâu?', usage: 'After landing', order: 3 },
          { phrase: 'I have nothing to declare', meaning: 'Tôi không có gì để khai báo', usage: 'At customs', order: 4 },
        ]
      }
    }
  })

  console.log('🏨 Thêm bài học Hotel...')

  await prisma.lesson.create({
    data: {
      title: 'Hotel Check-in - Nhận phòng khách sạn',
      description: 'Học cách đặt phòng và làm thủ tục nhận phòng khách sạn',
      level: 'intermediate',
      duration: '25',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezəˈveɪʃn/', meaning: 'Đặt phòng', example: 'I have a reservation for tonight.', order: 1 },
          { word: 'Single room', pronunciation: '/ˈsɪŋɡl ruːm/', meaning: 'Phòng đơn', example: 'I\'d like a single room.', order: 2 },
          { word: 'Double room', pronunciation: '/ˈdʌbl ruːm/', meaning: 'Phòng đôi', example: 'We need a double room.', order: 3 },
          { word: 'Suite', pronunciation: '/swiːt/', meaning: 'Phòng cao cấp', example: 'The presidential suite is amazing.', order: 4 },
          { word: 'Room key', pronunciation: '/ruːm kiː/', meaning: 'Chìa khóa phòng', example: 'Here\'s your room key.', order: 5 },
          { word: 'Breakfast included', pronunciation: '/ˈbrekfəst ɪnˈkluːdɪd/', meaning: 'Bao gồm bữa sáng', example: 'Is breakfast included?', order: 6 },
          { word: 'Check-out time', pronunciation: '/tʃek aʊt taɪm/', meaning: 'Giờ trả phòng', example: 'Check-out time is 11 AM.', order: 7 },
          { word: 'Reception', pronunciation: '/rɪˈsepʃn/', meaning: 'Lễ tân', example: 'Please contact reception.', order: 8 },
          { word: 'Room service', pronunciation: '/ruːm ˈsɜːvɪs/', meaning: 'Dịch vụ phòng', example: 'I\'d like to order room service.', order: 9 },
          { word: 'Wi-Fi', pronunciation: '/ˈwaɪfaɪ/', meaning: 'Wifi', example: 'What\'s the Wi-Fi password?', order: 10 },
          { word: 'Air conditioning', pronunciation: '/eər kənˈdɪʃənɪŋ/', meaning: 'Điều hòa', example: 'The air conditioning isn\'t working.', order: 11 },
          { word: 'Minibar', pronunciation: '/ˈmɪnibɑːr/', meaning: 'Tủ lạnh mini', example: 'The minibar is stocked.', order: 12 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Hotel check-in',
            participants: ['Receptionist', 'Guest'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Receptionist', text: 'Good afternoon! Welcome to Grand Hotel. How may I help you?', translation: 'Chào buổi chiều! Chào mừng đến Grand Hotel. Tôi có thể giúp gì?', order: 1, gender: 'female' },
                { speaker: 'Guest', text: 'Hi, I have a reservation under the name David Brown.', translation: 'Xin chào, tôi đặt phòng dưới tên David Brown.', order: 2, gender: 'male' },
                { speaker: 'Receptionist', text: 'Let me check... Yes, a double room for three nights. Correct?', translation: 'Để tôi kiểm tra... Vâng, phòng đôi ba đêm. Đúng không ạ?', order: 3, gender: 'female' },
                { speaker: 'Guest', text: 'That\'s correct. Is breakfast included?', translation: 'Đúng rồi. Bữa sáng có bao gồm không?', order: 4, gender: 'male' },
                { speaker: 'Receptionist', text: 'Yes, breakfast is served from 7 to 10 AM in the restaurant.', translation: 'Có, bữa sáng phục vụ từ 7 đến 10 giờ sáng tại nhà hàng.', order: 5, gender: 'female' },
                { speaker: 'Guest', text: 'Great! What\'s the Wi-Fi password?', translation: 'Tuyệt! Mật khẩu Wi-Fi là gì?', order: 6, gender: 'male' },
                { speaker: 'Receptionist', text: 'It\'s on this card. Your room is 405 on the 4th floor.', translation: 'Ở trong thẻ này. Phòng của anh là 405 tầng 4.', order: 7, gender: 'female' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'d like to check in', meaning: 'Tôi muốn nhận phòng', usage: 'At arrival', order: 1 },
          { phrase: 'Can I have a late check-out?', meaning: 'Tôi có thể trả phòng muộn không?', usage: 'Requesting extension', order: 2 },
          { phrase: 'Could you call a taxi?', meaning: 'Bạn có thể gọi taxi giúp tôi không?', usage: 'Requesting service', order: 3 },
          { phrase: 'Is there a gym/pool?', meaning: 'Có phòng gym/hồ bơi không?', usage: 'Asking about facilities', order: 4 },
        ]
      }
    }
  })

  console.log('💼 Thêm bài học Job Interview...')

  await prisma.lesson.create({
    data: {
      title: 'Job Interview - Phỏng vấn xin việc',
      description: 'Chuẩn bị cho buổi phỏng vấn việc làm bằng tiếng Anh',
      level: 'intermediate',
      duration: '35',
      categoryId: workCategory.id,
      vocabulary: {
        create: [
          { word: 'Resume/CV', pronunciation: '/ˈrezjuːmeɪ/ /ˌsiːˈviː/', meaning: 'Sơ yếu lý lịch', example: 'Please send your resume.', order: 1 },
          { word: 'Experience', pronunciation: '/ɪkˈspɪəriəns/', meaning: 'Kinh nghiệm', example: 'I have 5 years of experience.', order: 2 },
          { word: 'Qualification', pronunciation: '/ˌkwɒlɪfɪˈkeɪʃn/', meaning: 'Bằng cấp', example: 'What are your qualifications?', order: 3 },
          { word: 'Strength', pronunciation: '/streŋθ/', meaning: 'Điểm mạnh', example: 'My strength is problem-solving.', order: 4 },
          { word: 'Weakness', pronunciation: '/ˈwiːknəs/', meaning: 'Điểm yếu', example: 'My weakness is public speaking.', order: 5 },
          { word: 'Salary', pronunciation: '/ˈsæləri/', meaning: 'Lương', example: 'What\'s the salary range?', order: 6 },
          { word: 'Benefits', pronunciation: '/ˈbenɪfɪts/', meaning: 'Phúc lợi', example: 'The benefits include health insurance.', order: 7 },
          { word: 'Deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'Hạn chót', example: 'I always meet deadlines.', order: 8 },
          { word: 'Team player', pronunciation: '/tiːm ˈpleɪər/', meaning: 'Người biết làm việc nhóm', example: 'I\'m a good team player.', order: 9 },
          { word: 'Motivated', pronunciation: '/ˈməʊtɪveɪtɪd/', meaning: 'Có động lực', example: 'I\'m highly motivated.', order: 10 },
          { word: 'Position', pronunciation: '/pəˈzɪʃn/', meaning: 'Vị trí', example: 'I\'m applying for this position.', order: 11 },
          { word: 'Hire', pronunciation: '/haɪər/', meaning: 'Tuyển dụng', example: 'We\'d like to hire you.', order: 12 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Job interview conversation',
            participants: ['Interviewer', 'Candidate'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Interviewer', text: 'Tell me about yourself.', translation: 'Hãy giới thiệu về bản thân.', order: 1, gender: 'female' },
                { speaker: 'Candidate', text: 'I\'m a software developer with 3 years of experience.', translation: 'Tôi là lập trình viên với 3 năm kinh nghiệm.', order: 2, gender: 'male' },
                { speaker: 'Interviewer', text: 'What are your greatest strengths?', translation: 'Điểm mạnh lớn nhất của bạn là gì?', order: 3, gender: 'female' },
                { speaker: 'Candidate', text: 'I\'m a fast learner and work well under pressure.', translation: 'Tôi học nhanh và làm việc tốt dưới áp lực.', order: 4, gender: 'male' },
                { speaker: 'Interviewer', text: 'Why do you want to work for our company?', translation: 'Tại sao bạn muốn làm việc cho công ty chúng tôi?', order: 5, gender: 'female' },
                { speaker: 'Candidate', text: 'I admire your innovative products and company culture.', translation: 'Tôi ngưỡng mộ sản phẩm sáng tạo và văn hóa công ty.', order: 6, gender: 'male' },
                { speaker: 'Interviewer', text: 'Where do you see yourself in 5 years?', translation: 'Bạn thấy mình ở đâu sau 5 năm?', order: 7, gender: 'female' },
                { speaker: 'Candidate', text: 'I hope to grow into a leadership role.', translation: 'Tôi hy vọng phát triển lên vị trí lãnh đạo.', order: 8, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m passionate about...', meaning: 'Tôi đam mê về...', usage: 'Showing enthusiasm', order: 1 },
          { phrase: 'I have experience in...', meaning: 'Tôi có kinh nghiệm về...', usage: 'Describing skills', order: 2 },
          { phrase: 'When can I expect to hear back?', meaning: 'Khi nào tôi có thể nhận phản hồi?', usage: 'End of interview', order: 3 },
          { phrase: 'Thank you for the opportunity', meaning: 'Cảm ơn vì cơ hội', usage: 'Being polite', order: 4 },
        ]
      }
    }
  })

  console.log('📧 Thêm bài học Email Writing...')

  await prisma.lesson.create({
    data: {
      title: 'Business Email - Email công việc',
      description: 'Cách viết email chuyên nghiệp bằng tiếng Anh',
      level: 'intermediate',
      duration: '30',
      categoryId: workCategory.id,
      vocabulary: {
        create: [
          { word: 'Subject line', pronunciation: '/ˈsʌbdʒɪkt laɪn/', meaning: 'Tiêu đề email', example: 'Use a clear subject line.', order: 1 },
          { word: 'Attachment', pronunciation: '/əˈtætʃmənt/', meaning: 'File đính kèm', example: 'Please see the attachment.', order: 2 },
          { word: 'Regards', pronunciation: '/rɪˈɡɑːdz/', meaning: 'Trân trọng', example: 'Best regards, John', order: 3 },
          { word: 'Inquiry', pronunciation: '/ɪnˈkwaɪəri/', meaning: 'Yêu cầu thông tin', example: 'Thank you for your inquiry.', order: 4 },
          { word: 'Follow up', pronunciation: '/ˈfɒləʊ ʌp/', meaning: 'Theo dõi, nhắc lại', example: 'I\'m following up on my previous email.', order: 5 },
          { word: 'Urgent', pronunciation: '/ˈɜːdʒənt/', meaning: 'Khẩn cấp', example: 'This is an urgent matter.', order: 6 },
          { word: 'Sincerely', pronunciation: '/sɪnˈsɪəli/', meaning: 'Chân thành', example: 'Sincerely yours, Mary', order: 7 },
          { word: 'Recipient', pronunciation: '/rɪˈsɪpiənt/', meaning: 'Người nhận', example: 'Check the recipient address.', order: 8 },
          { word: 'Forward', pronunciation: '/ˈfɔːwəd/', meaning: 'Chuyển tiếp', example: 'I\'ll forward this to my team.', order: 9 },
          { word: 'CC (Carbon Copy)', pronunciation: '/ˌsiːˈsiː/', meaning: 'Sao chép cho', example: 'Please CC me on that email.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I hope this email finds you well', meaning: 'Tôi hy vọng bạn khỏe mạnh', usage: 'Email opening', order: 1 },
          { phrase: 'Please find attached', meaning: 'Xin xem file đính kèm', usage: 'With attachments', order: 2 },
          { phrase: 'I look forward to hearing from you', meaning: 'Tôi mong nhận được phản hồi', usage: 'Email closing', order: 3 },
          { phrase: 'Thank you for your prompt reply', meaning: 'Cảm ơn phản hồi nhanh chóng', usage: 'Showing appreciation', order: 4 },
          { phrase: 'Please let me know if you have any questions', meaning: 'Vui lòng cho tôi biết nếu có câu hỏi', usage: 'Offering help', order: 5 },
          { phrase: 'I apologize for the delay', meaning: 'Xin lỗi vì sự chậm trễ', usage: 'Apologizing', order: 6 },
        ]
      }
    }
  })

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
          { word: 'Exchange', pronunciation: '/ɪksˈtʃeɪndʒ/', meaning: 'Đổi hàng', example: 'Can I exchange this?', order: 11 },
          { word: 'Expensive', pronunciation: '/ɪkˈspensɪv/', meaning: 'Đắt', example: 'That\'s too expensive.', order: 12 },
          { word: 'Cheap', pronunciation: '/tʃiːp/', meaning: 'Rẻ', example: 'This is quite cheap.', order: 13 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'At a clothing store',
            participants: ['Shop assistant', 'Customer'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Shop assistant', text: 'Hello! Can I help you with anything?', translation: 'Xin chào! Tôi có thể giúp gì cho bạn?', order: 1, gender: 'female' },
                { speaker: 'Customer', text: 'Yes, I\'m looking for a jacket.', translation: 'Vâng, tôi đang tìm một chiếc áo khoác.', order: 2, gender: 'male' },
                { speaker: 'Shop assistant', text: 'What size do you need?', translation: 'Bạn cần cỡ nào?', order: 3, gender: 'female' },
                { speaker: 'Customer', text: 'Medium. Do you have this in black?', translation: 'Cỡ M. Bạn có màu đen không?', order: 4, gender: 'male' },
                { speaker: 'Shop assistant', text: 'Yes, we do. Would you like to try it on?', translation: 'Có. Bạn có muốn thử không?', order: 5, gender: 'female' },
                { speaker: 'Customer', text: 'Yes, please. Where\'s the fitting room?', translation: 'Vâng, cảm ơn. Phòng thử đồ ở đâu?', order: 6, gender: 'male' },
                { speaker: 'Shop assistant', text: 'It\'s right over there. This jacket is 20% off today!', translation: 'Ở ngay đằng kia. Áo khoác này hôm nay giảm 20%!', order: 7, gender: 'female' },
                { speaker: 'Customer', text: 'Great! I\'ll take it. Can I pay by card?', translation: 'Tuyệt! Tôi lấy cái này. Tôi có thể thanh toán bằng thẻ không?', order: 8, gender: 'male' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m just looking', meaning: 'Tôi chỉ xem thôi', usage: 'Browsing', order: 1 },
          { phrase: 'Can I try this on?', meaning: 'Tôi có thể thử cái này không?', usage: 'Before trying clothes', order: 2 },
          { phrase: 'It doesn\'t fit', meaning: 'Nó không vừa', usage: 'Wrong size', order: 3 },
          { phrase: 'I\'ll take it', meaning: 'Tôi sẽ mua cái này', usage: 'Making purchase', order: 4 },
        ]
      }
    }
  })

  console.log('🏥 Thêm bài học Health & Doctor...')

  await prisma.lesson.create({
    data: {
      title: 'Health & Doctor - Sức khỏe và Bác sĩ',
      description: 'Từ vựng y tế và cách mô tả triệu chứng bệnh',
      level: 'intermediate',
      duration: '30',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Headache', pronunciation: '/ˈhedeɪk/', meaning: 'Đau đầu', example: 'I have a terrible headache.', order: 1 },
          { word: 'Fever', pronunciation: '/ˈfiːvər/', meaning: 'Sốt', example: 'She has a high fever.', order: 2 },
          { word: 'Cough', pronunciation: '/kɒf/', meaning: 'Ho', example: 'I can\'t stop coughing.', order: 3 },
          { word: 'Sore throat', pronunciation: '/sɔːr θrəʊt/', meaning: 'Đau họng', example: 'My sore throat is getting worse.', order: 4 },
          { word: 'Stomachache', pronunciation: '/ˈstʌməkeɪk/', meaning: 'Đau bụng', example: 'I have a stomachache.', order: 5 },
          { word: 'Allergy', pronunciation: '/ˈælərdʒi/', meaning: 'Dị ứng', example: 'I\'m allergic to peanuts.', order: 6 },
          { word: 'Prescription', pronunciation: '/prɪˈskrɪpʃn/', meaning: 'Đơn thuốc', example: 'Here\'s your prescription.', order: 7 },
          { word: 'Medicine', pronunciation: '/ˈmedsn/', meaning: 'Thuốc', example: 'Take this medicine twice a day.', order: 8 },
          { word: 'Symptom', pronunciation: '/ˈsɪmptəm/', meaning: 'Triệu chứng', example: 'What are your symptoms?', order: 9 },
          { word: 'Appointment', pronunciation: '/əˈpɔɪntmənt/', meaning: 'Cuộc hẹn', example: 'I\'d like to make an appointment.', order: 10 },
          { word: 'Examination', pronunciation: '/ɪɡˌzæmɪˈneɪʃn/', meaning: 'Khám bệnh', example: 'The examination shows nothing serious.', order: 11 },
          { word: 'Insurance', pronunciation: '/ɪnˈʃʊərəns/', meaning: 'Bảo hiểm', example: 'Do you have health insurance?', order: 12 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'At the doctor\'s office',
            participants: ['Doctor', 'Patient'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Doctor', text: 'Good morning. What seems to be the problem?', translation: 'Chào buổi sáng. Bạn có vấn đề gì?', order: 1, gender: 'male' },
                { speaker: 'Patient', text: 'I\'ve been feeling unwell. I have a fever and sore throat.', translation: 'Tôi cảm thấy không khỏe. Tôi bị sốt và đau họng.', order: 2, gender: 'female' },
                { speaker: 'Doctor', text: 'How long have you had these symptoms?', translation: 'Bạn có các triệu chứng này bao lâu rồi?', order: 3, gender: 'male' },
                { speaker: 'Patient', text: 'About three days now.', translation: 'Khoảng ba ngày rồi.', order: 4, gender: 'female' },
                { speaker: 'Doctor', text: 'Let me check your temperature. It\'s 38.5 degrees.', translation: 'Để tôi đo nhiệt độ. 38,5 độ.', order: 5, gender: 'male' },
                { speaker: 'Patient', text: 'Is it serious, doctor?', translation: 'Có nghiêm trọng không, bác sĩ?', order: 6, gender: 'female' },
                { speaker: 'Doctor', text: 'It\'s just a common cold. I\'ll give you some medicine.', translation: 'Chỉ là cảm lạnh thông thường. Tôi sẽ kê thuốc cho bạn.', order: 7, gender: 'male' },
                { speaker: 'Patient', text: 'Thank you. How often should I take it?', translation: 'Cảm ơn. Tôi nên uống mấy lần một ngày?', order: 8, gender: 'female' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'I don\'t feel well', meaning: 'Tôi không khỏe', usage: 'Describing illness', order: 1 },
          { phrase: 'It hurts here', meaning: 'Đau ở đây', usage: 'Pointing to pain location', order: 2 },
          { phrase: 'Take two pills a day', meaning: 'Uống hai viên một ngày', usage: 'Medicine instructions', order: 3 },
          { phrase: 'Get well soon', meaning: 'Chúc mau khỏe', usage: 'Wishing recovery', order: 4 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã thêm nội dung:')
  console.log('   - 150+ từ vựng mới')
  console.log('   - 15+ bài học đa dạng')
  console.log('   - Idioms, Phrasal Verbs, Academic')
  console.log('   - Daily Life, Travel, Work')
  console.log('   - 50+ cụm từ thông dụng')
  console.log('   - 10+ đoạn hội thoại thực tế\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
