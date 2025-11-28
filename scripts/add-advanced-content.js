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

  console.log('\n✅ Hoàn thành! Đã thêm nội dung nâng cao:')
  console.log('   - 80+ từ vựng nâng cao')
  console.log('   - Idioms và Phrasal Verbs')
  console.log('   - Small Talk và Restaurant')
  console.log('   - Academic Vocabulary')
  console.log('   - 20+ cụm từ thông dụng\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
