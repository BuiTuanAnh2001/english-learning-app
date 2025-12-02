const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Thêm nội dung bổ sung...\n')

  // Lấy categories
  const categories = await prisma.category.findMany()
  const getCategory = (name) => categories.find(c => c.name === name) || categories[0]

  // ============ BÀI HỌC: WEATHER ============
  console.log('🌤️ Thêm bài học Weather...')
  await prisma.lesson.create({
    data: {
      title: 'Weather & Seasons - Thời tiết và Mùa',
      description: 'Học cách mô tả thời tiết và các mùa trong năm',
      level: 'beginner',
      duration: '20',
      categoryId: getCategory('daily').id,
      vocabulary: {
        create: [
          { word: 'Sunny', pronunciation: '/ˈsʌni/', meaning: 'Nắng', example: 'It\'s a sunny day!', order: 1 },
          { word: 'Cloudy', pronunciation: '/ˈklaʊdi/', meaning: 'Nhiều mây', example: 'It\'s cloudy today.', order: 2 },
          { word: 'Rainy', pronunciation: '/ˈreɪni/', meaning: 'Có mưa', example: 'It\'s rainy outside.', order: 3 },
          { word: 'Windy', pronunciation: '/ˈwɪndi/', meaning: 'Có gió', example: 'It\'s very windy today.', order: 4 },
          { word: 'Snowy', pronunciation: '/ˈsnəʊi/', meaning: 'Có tuyết', example: 'It\'s snowy in winter.', order: 5 },
          { word: 'Hot', pronunciation: '/hɒt/', meaning: 'Nóng', example: 'It\'s so hot today!', order: 6 },
          { word: 'Cold', pronunciation: '/kəʊld/', meaning: 'Lạnh', example: 'It\'s cold outside.', order: 7 },
          { word: 'Spring', pronunciation: '/sprɪŋ/', meaning: 'Mùa xuân', example: 'Spring is beautiful.', order: 8 },
          { word: 'Summer', pronunciation: '/ˈsʌmər/', meaning: 'Mùa hè', example: 'I love summer vacation.', order: 9 },
          { word: 'Autumn/Fall', pronunciation: '/ˈɔːtəm/', meaning: 'Mùa thu', example: 'Autumn leaves are colorful.', order: 10 },
          { word: 'Winter', pronunciation: '/ˈwɪntər/', meaning: 'Mùa đông', example: 'Winter is very cold.', order: 11 },
          { word: 'Forecast', pronunciation: '/ˈfɔːkɑːst/', meaning: 'Dự báo', example: 'What\'s the weather forecast?', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Alice', text: 'What\'s the weather like today?', translation: 'Thời tiết hôm nay thế nào?', order: 1, gender: 'female' },
          { speaker: 'Bob', text: 'It\'s sunny but a bit windy.', translation: 'Trời nắng nhưng hơi có gió.', order: 2, gender: 'male' },
          { speaker: 'Alice', text: 'Perfect weather for a picnic!', translation: 'Thời tiết hoàn hảo cho picnic!', order: 3, gender: 'female' },
          { speaker: 'Bob', text: 'Yes! But the forecast says it might rain later.', translation: 'Vâng! Nhưng dự báo nói có thể mưa sau.', order: 4, gender: 'male' },
          { speaker: 'Alice', text: 'Let\'s bring an umbrella just in case.', translation: 'Mang theo ô phòng khi nhé.', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What\'s the weather like?', meaning: 'Thời tiết thế nào?', example: 'What\'s the weather like in Hanoi?', order: 1 },
          { phrase: 'It looks like rain', meaning: 'Trông như sắp mưa', example: 'It looks like rain, take an umbrella.', order: 2 },
          { phrase: 'Bundle up!', meaning: 'Mặc ấm vào!', example: 'It\'s freezing! Bundle up!', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: COLORS & SHAPES ============
  console.log('🎨 Thêm bài học Colors & Shapes...')
  await prisma.lesson.create({
    data: {
      title: 'Colors & Shapes - Màu sắc và Hình dạng',
      description: 'Học các màu sắc và hình dạng cơ bản',
      level: 'beginner',
      duration: '15',
      categoryId: getCategory('beginner').id,
      vocabulary: {
        create: [
          { word: 'Red', pronunciation: '/red/', meaning: 'Màu đỏ', example: 'The apple is red.', order: 1 },
          { word: 'Blue', pronunciation: '/bluː/', meaning: 'Màu xanh dương', example: 'The sky is blue.', order: 2 },
          { word: 'Green', pronunciation: '/ɡriːn/', meaning: 'Màu xanh lá', example: 'Grass is green.', order: 3 },
          { word: 'Yellow', pronunciation: '/ˈjeləʊ/', meaning: 'Màu vàng', example: 'Bananas are yellow.', order: 4 },
          { word: 'Orange', pronunciation: '/ˈɒrɪndʒ/', meaning: 'Màu cam', example: 'Oranges are orange.', order: 5 },
          { word: 'Purple', pronunciation: '/ˈpɜːpl/', meaning: 'Màu tím', example: 'Grapes can be purple.', order: 6 },
          { word: 'Black', pronunciation: '/blæk/', meaning: 'Màu đen', example: 'My car is black.', order: 7 },
          { word: 'White', pronunciation: '/waɪt/', meaning: 'Màu trắng', example: 'Snow is white.', order: 8 },
          { word: 'Circle', pronunciation: '/ˈsɜːkl/', meaning: 'Hình tròn', example: 'The wheel is a circle.', order: 9 },
          { word: 'Square', pronunciation: '/skweər/', meaning: 'Hình vuông', example: 'The box is square.', order: 10 },
          { word: 'Triangle', pronunciation: '/ˈtraɪæŋɡl/', meaning: 'Hình tam giác', example: 'A pyramid has triangles.', order: 11 },
          { word: 'Rectangle', pronunciation: '/ˈrektæŋɡl/', meaning: 'Hình chữ nhật', example: 'The door is a rectangle.', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Teacher', text: 'What color is this?', translation: 'Đây là màu gì?', order: 1, gender: 'female' },
          { speaker: 'Student', text: 'It\'s blue!', translation: 'Màu xanh dương!', order: 2, gender: 'male' },
          { speaker: 'Teacher', text: 'Great! And what shape is this?', translation: 'Tuyệt! Và đây là hình gì?', order: 3, gender: 'female' },
          { speaker: 'Student', text: 'It\'s a circle.', translation: 'Đó là hình tròn.', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What color is it?', meaning: 'Nó màu gì?', example: 'What color is your car?', order: 1 },
          { phrase: 'My favorite color is...', meaning: 'Màu yêu thích của tôi là...', example: 'My favorite color is blue.', order: 2 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: FOOD & DRINKS ============
  console.log('🍕 Thêm bài học Food & Drinks...')
  await prisma.lesson.create({
    data: {
      title: 'Food & Drinks - Đồ ăn và Đồ uống',
      description: 'Học từ vựng về các loại thức ăn và đồ uống',
      level: 'beginner',
      duration: '25',
      categoryId: getCategory('daily').id,
      vocabulary: {
        create: [
          { word: 'Bread', pronunciation: '/bred/', meaning: 'Bánh mì', example: 'I eat bread for breakfast.', order: 1 },
          { word: 'Rice', pronunciation: '/raɪs/', meaning: 'Cơm', example: 'Vietnamese people eat rice every day.', order: 2 },
          { word: 'Chicken', pronunciation: '/ˈtʃɪkɪn/', meaning: 'Thịt gà', example: 'I love fried chicken.', order: 3 },
          { word: 'Beef', pronunciation: '/biːf/', meaning: 'Thịt bò', example: 'Beef pho is delicious.', order: 4 },
          { word: 'Fish', pronunciation: '/fɪʃ/', meaning: 'Cá', example: 'Fish is healthy food.', order: 5 },
          { word: 'Vegetables', pronunciation: '/ˈvedʒtəblz/', meaning: 'Rau củ', example: 'Eat more vegetables.', order: 6 },
          { word: 'Fruit', pronunciation: '/fruːt/', meaning: 'Trái cây', example: 'I like fresh fruit.', order: 7 },
          { word: 'Water', pronunciation: '/ˈwɔːtər/', meaning: 'Nước', example: 'Drink more water.', order: 8 },
          { word: 'Coffee', pronunciation: '/ˈkɒfi/', meaning: 'Cà phê', example: 'I need my morning coffee.', order: 9 },
          { word: 'Tea', pronunciation: '/tiː/', meaning: 'Trà', example: 'Would you like some tea?', order: 10 },
          { word: 'Juice', pronunciation: '/dʒuːs/', meaning: 'Nước ép', example: 'Orange juice is my favorite.', order: 11 },
          { word: 'Milk', pronunciation: '/mɪlk/', meaning: 'Sữa', example: 'Children should drink milk.', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Waiter', text: 'What would you like to order?', translation: 'Bạn muốn gọi món gì?', order: 1, gender: 'male' },
          { speaker: 'Customer', text: 'I\'ll have the chicken rice, please.', translation: 'Cho tôi cơm gà.', order: 2, gender: 'female' },
          { speaker: 'Waiter', text: 'And to drink?', translation: 'Còn đồ uống?', order: 3, gender: 'male' },
          { speaker: 'Customer', text: 'Just water, thank you.', translation: 'Chỉ nước lọc, cảm ơn.', order: 4, gender: 'female' },
          { speaker: 'Waiter', text: 'Coming right up!', translation: 'Ra ngay ạ!', order: 5, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m hungry', meaning: 'Tôi đói', example: 'I\'m hungry. Let\'s eat!', order: 1 },
          { phrase: 'I\'m thirsty', meaning: 'Tôi khát', example: 'I\'m thirsty. Can I have some water?', order: 2 },
          { phrase: 'This is delicious!', meaning: 'Món này ngon quá!', example: 'Wow, this is delicious!', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: DIRECTIONS ============
  console.log('🧭 Thêm bài học Directions...')
  await prisma.lesson.create({
    data: {
      title: 'Directions - Chỉ đường',
      description: 'Học cách hỏi và chỉ đường',
      level: 'intermediate',
      duration: '25',
      categoryId: getCategory('travel').id,
      vocabulary: {
        create: [
          { word: 'Turn left', pronunciation: '/tɜːn left/', meaning: 'Rẽ trái', example: 'Turn left at the corner.', order: 1 },
          { word: 'Turn right', pronunciation: '/tɜːn raɪt/', meaning: 'Rẽ phải', example: 'Turn right at the traffic light.', order: 2 },
          { word: 'Go straight', pronunciation: '/ɡəʊ streɪt/', meaning: 'Đi thẳng', example: 'Go straight for 100 meters.', order: 3 },
          { word: 'Crossroads', pronunciation: '/ˈkrɒsrəʊdz/', meaning: 'Ngã tư', example: 'Stop at the crossroads.', order: 4 },
          { word: 'Traffic light', pronunciation: '/ˈtræfɪk laɪt/', meaning: 'Đèn giao thông', example: 'Wait at the traffic light.', order: 5 },
          { word: 'Corner', pronunciation: '/ˈkɔːnər/', meaning: 'Góc đường', example: 'The shop is on the corner.', order: 6 },
          { word: 'Next to', pronunciation: '/nekst tuː/', meaning: 'Bên cạnh', example: 'The bank is next to the hospital.', order: 7 },
          { word: 'Opposite', pronunciation: '/ˈɒpəzɪt/', meaning: 'Đối diện', example: 'The café is opposite the park.', order: 8 },
          { word: 'Between', pronunciation: '/bɪˈtwiːn/', meaning: 'Giữa', example: 'It\'s between the hotel and the museum.', order: 9 },
          { word: 'Roundabout', pronunciation: '/ˈraʊndəbaʊt/', meaning: 'Vòng xuyến', example: 'Take the second exit at the roundabout.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Tourist', text: 'Excuse me, how do I get to the train station?', translation: 'Xin lỗi, đi đến ga tàu như thế nào?', order: 1, gender: 'female' },
          { speaker: 'Local', text: 'Go straight ahead for about 200 meters.', translation: 'Đi thẳng khoảng 200m.', order: 2, gender: 'male' },
          { speaker: 'Local', text: 'Then turn left at the traffic light.', translation: 'Sau đó rẽ trái ở đèn đỏ.', order: 3, gender: 'male' },
          { speaker: 'Tourist', text: 'Is it far from here?', translation: 'Từ đây có xa không?', order: 4, gender: 'female' },
          { speaker: 'Local', text: 'No, it\'s about a 5-minute walk.', translation: 'Không, đi bộ khoảng 5 phút.', order: 5, gender: 'male' },
          { speaker: 'Tourist', text: 'Thank you so much!', translation: 'Cảm ơn nhiều!', order: 6, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Excuse me, where is...?', meaning: 'Xin lỗi, ... ở đâu?', example: 'Excuse me, where is the nearest bank?', order: 1 },
          { phrase: 'How do I get to...?', meaning: 'Làm sao để đến...?', example: 'How do I get to the airport?', order: 2 },
          { phrase: 'Is it within walking distance?', meaning: 'Có đi bộ được không?', example: 'Is the museum within walking distance?', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: TRANSPORTATION ============
  console.log('🚗 Thêm bài học Transportation...')
  await prisma.lesson.create({
    data: {
      title: 'Transportation - Phương tiện giao thông',
      description: 'Học từ vựng về các phương tiện đi lại',
      level: 'beginner',
      duration: '20',
      categoryId: getCategory('travel').id,
      vocabulary: {
        create: [
          { word: 'Car', pronunciation: '/kɑːr/', meaning: 'Ô tô', example: 'I drive my car to work.', order: 1 },
          { word: 'Bus', pronunciation: '/bʌs/', meaning: 'Xe buýt', example: 'Take the bus to school.', order: 2 },
          { word: 'Train', pronunciation: '/treɪn/', meaning: 'Tàu hỏa', example: 'The train is very fast.', order: 3 },
          { word: 'Plane', pronunciation: '/pleɪn/', meaning: 'Máy bay', example: 'We\'ll fly by plane.', order: 4 },
          { word: 'Bicycle', pronunciation: '/ˈbaɪsɪkl/', meaning: 'Xe đạp', example: 'Riding a bicycle is healthy.', order: 5 },
          { word: 'Motorbike', pronunciation: '/ˈməʊtəbaɪk/', meaning: 'Xe máy', example: 'Motorbikes are popular in Vietnam.', order: 6 },
          { word: 'Taxi', pronunciation: '/ˈtæksi/', meaning: 'Taxi', example: 'Let\'s take a taxi.', order: 7 },
          { word: 'Subway', pronunciation: '/ˈsʌbweɪ/', meaning: 'Tàu điện ngầm', example: 'The subway is convenient.', order: 8 },
          { word: 'Ferry', pronunciation: '/ˈferi/', meaning: 'Phà', example: 'Take the ferry to the island.', order: 9 },
          { word: 'Ticket', pronunciation: '/ˈtɪkɪt/', meaning: 'Vé', example: 'I need to buy a ticket.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Passenger', text: 'One ticket to the city center, please.', translation: 'Một vé đến trung tâm thành phố.', order: 1, gender: 'female' },
          { speaker: 'Staff', text: 'That\'s 30,000 dong.', translation: 'Giá 30 nghìn đồng.', order: 2, gender: 'male' },
          { speaker: 'Passenger', text: 'What time does the next bus leave?', translation: 'Chuyến bus tiếp theo mấy giờ?', order: 3, gender: 'female' },
          { speaker: 'Staff', text: 'In about 10 minutes.', translation: 'Khoảng 10 phút nữa.', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'How much is the fare?', meaning: 'Giá vé bao nhiêu?', example: 'How much is the fare to the airport?', order: 1 },
          { phrase: 'Which platform?', meaning: 'Sân ga nào?', example: 'Which platform does the train leave from?', order: 2 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: EMOTIONS ============
  console.log('😊 Thêm bài học Emotions...')
  await prisma.lesson.create({
    data: {
      title: 'Emotions & Feelings - Cảm xúc',
      description: 'Học cách diễn tả cảm xúc và tình cảm',
      level: 'intermediate',
      duration: '25',
      categoryId: getCategory('daily').id,
      vocabulary: {
        create: [
          { word: 'Happy', pronunciation: '/ˈhæpi/', meaning: 'Vui vẻ', example: 'I\'m so happy today!', order: 1 },
          { word: 'Sad', pronunciation: '/sæd/', meaning: 'Buồn', example: 'She looks sad.', order: 2 },
          { word: 'Angry', pronunciation: '/ˈæŋɡri/', meaning: 'Tức giận', example: 'Don\'t make him angry.', order: 3 },
          { word: 'Excited', pronunciation: '/ɪkˈsaɪtɪd/', meaning: 'Hào hứng', example: 'I\'m excited about the trip!', order: 4 },
          { word: 'Nervous', pronunciation: '/ˈnɜːvəs/', meaning: 'Lo lắng', example: 'I\'m nervous about the exam.', order: 5 },
          { word: 'Tired', pronunciation: '/taɪəd/', meaning: 'Mệt mỏi', example: 'I\'m so tired after work.', order: 6 },
          { word: 'Surprised', pronunciation: '/səˈpraɪzd/', meaning: 'Ngạc nhiên', example: 'I was surprised to see her.', order: 7 },
          { word: 'Scared', pronunciation: '/skeəd/', meaning: 'Sợ hãi', example: 'Are you scared of spiders?', order: 8 },
          { word: 'Bored', pronunciation: '/bɔːd/', meaning: 'Chán', example: 'This movie is boring.', order: 9 },
          { word: 'Grateful', pronunciation: '/ˈɡreɪtfl/', meaning: 'Biết ơn', example: 'I\'m grateful for your help.', order: 10 },
          { word: 'Disappointed', pronunciation: '/ˌdɪsəˈpɔɪntɪd/', meaning: 'Thất vọng', example: 'I\'m disappointed with the result.', order: 11 },
          { word: 'Proud', pronunciation: '/praʊd/', meaning: 'Tự hào', example: 'I\'m proud of you!', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Friend 1', text: 'How are you feeling today?', translation: 'Hôm nay bạn cảm thấy thế nào?', order: 1, gender: 'female' },
          { speaker: 'Friend 2', text: 'A bit nervous, actually.', translation: 'Hơi lo lắng thực ra.', order: 2, gender: 'male' },
          { speaker: 'Friend 1', text: 'Why? What\'s wrong?', translation: 'Sao vậy? Có chuyện gì?', order: 3, gender: 'female' },
          { speaker: 'Friend 2', text: 'I have a job interview tomorrow.', translation: 'Ngày mai tôi có phỏng vấn xin việc.', order: 4, gender: 'male' },
          { speaker: 'Friend 1', text: 'Don\'t worry! You\'ll do great!', translation: 'Đừng lo! Bạn sẽ làm tốt!', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m over the moon!', meaning: 'Tôi vui sướng tột độ!', example: 'I got the job! I\'m over the moon!', order: 1 },
          { phrase: 'I\'m feeling down', meaning: 'Tôi cảm thấy chán nản', example: 'I\'m feeling down today.', order: 2 },
          { phrase: 'Cheer up!', meaning: 'Vui lên nào!', example: 'Cheer up! Things will get better.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: HOBBIES ============
  console.log('🎮 Thêm bài học Hobbies...')
  await prisma.lesson.create({
    data: {
      title: 'Hobbies & Interests - Sở thích',
      description: 'Học cách nói về sở thích và hoạt động giải trí',
      level: 'beginner',
      duration: '22',
      categoryId: getCategory('daily').id,
      vocabulary: {
        create: [
          { word: 'Reading', pronunciation: '/ˈriːdɪŋ/', meaning: 'Đọc sách', example: 'Reading is my favorite hobby.', order: 1 },
          { word: 'Swimming', pronunciation: '/ˈswɪmɪŋ/', meaning: 'Bơi lội', example: 'I go swimming every weekend.', order: 2 },
          { word: 'Cooking', pronunciation: '/ˈkʊkɪŋ/', meaning: 'Nấu ăn', example: 'She loves cooking Italian food.', order: 3 },
          { word: 'Traveling', pronunciation: '/ˈtrævəlɪŋ/', meaning: 'Du lịch', example: 'Traveling opens your mind.', order: 4 },
          { word: 'Photography', pronunciation: '/fəˈtɒɡrəfi/', meaning: 'Nhiếp ảnh', example: 'Photography is his passion.', order: 5 },
          { word: 'Gaming', pronunciation: '/ˈɡeɪmɪŋ/', meaning: 'Chơi game', example: 'Gaming is popular among teenagers.', order: 6 },
          { word: 'Painting', pronunciation: '/ˈpeɪntɪŋ/', meaning: 'Vẽ tranh', example: 'She started painting last year.', order: 7 },
          { word: 'Gardening', pronunciation: '/ˈɡɑːdnɪŋ/', meaning: 'Làm vườn', example: 'Gardening is very relaxing.', order: 8 },
          { word: 'Dancing', pronunciation: '/ˈdɑːnsɪŋ/', meaning: 'Nhảy múa', example: 'Do you like dancing?', order: 9 },
          { word: 'Hiking', pronunciation: '/ˈhaɪkɪŋ/', meaning: 'Leo núi', example: 'We go hiking on weekends.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Person A', text: 'What do you do in your free time?', translation: 'Bạn làm gì lúc rảnh?', order: 1, gender: 'female' },
          { speaker: 'Person B', text: 'I love reading and swimming.', translation: 'Tôi thích đọc sách và bơi lội.', order: 2, gender: 'male' },
          { speaker: 'Person A', text: 'That\'s cool! Do you have any other hobbies?', translation: 'Hay quá! Bạn còn sở thích nào khác không?', order: 3, gender: 'female' },
          { speaker: 'Person B', text: 'Yes, I\'m also into photography.', translation: 'Có, tôi cũng thích nhiếp ảnh.', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I\'m into...', meaning: 'Tôi thích/đam mê...', example: 'I\'m into Korean dramas.', order: 1 },
          { phrase: 'In my spare time', meaning: 'Trong thời gian rảnh', example: 'In my spare time, I read books.', order: 2 },
          { phrase: 'I\'m a big fan of...', meaning: 'Tôi rất thích...', example: 'I\'m a big fan of BTS.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: OFFICE ENGLISH ============
  console.log('💼 Thêm bài học Office English...')
  await prisma.lesson.create({
    data: {
      title: 'Office English - Tiếng Anh văn phòng',
      description: 'Từ vựng và giao tiếp nơi công sở',
      level: 'intermediate',
      duration: '30',
      categoryId: getCategory('work').id,
      vocabulary: {
        create: [
          { word: 'Meeting', pronunciation: '/ˈmiːtɪŋ/', meaning: 'Cuộc họp', example: 'We have a meeting at 10 AM.', order: 1 },
          { word: 'Deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'Hạn chót', example: 'The deadline is Friday.', order: 2 },
          { word: 'Report', pronunciation: '/rɪˈpɔːt/', meaning: 'Báo cáo', example: 'Please submit the report.', order: 3 },
          { word: 'Presentation', pronunciation: '/ˌpreznˈteɪʃn/', meaning: 'Bài thuyết trình', example: 'I\'m preparing a presentation.', order: 4 },
          { word: 'Email', pronunciation: '/ˈiːmeɪl/', meaning: 'Thư điện tử', example: 'I\'ll send you an email.', order: 5 },
          { word: 'Conference call', pronunciation: '/ˈkɒnfərəns kɔːl/', meaning: 'Cuộc gọi hội nghị', example: 'Join the conference call at 3 PM.', order: 6 },
          { word: 'Project', pronunciation: '/ˈprɒdʒekt/', meaning: 'Dự án', example: 'The project is almost done.', order: 7 },
          { word: 'Team', pronunciation: '/tiːm/', meaning: 'Nhóm/Đội', example: 'Work with your team.', order: 8 },
          { word: 'Schedule', pronunciation: '/ˈʃedjuːl/', meaning: 'Lịch trình', example: 'Check your schedule.', order: 9 },
          { word: 'Colleague', pronunciation: '/ˈkɒliːɡ/', meaning: 'Đồng nghiệp', example: 'She\'s my colleague.', order: 10 },
          { word: 'Overtime', pronunciation: '/ˈəʊvətaɪm/', meaning: 'Làm thêm giờ', example: 'I worked overtime yesterday.', order: 11 },
          { word: 'Promotion', pronunciation: '/prəˈməʊʃn/', meaning: 'Thăng chức', example: 'She got a promotion!', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Manager', text: 'Can you send me the report by EOD?', translation: 'Bạn gửi báo cáo cho tôi trước cuối ngày được không?', order: 1, gender: 'male' },
          { speaker: 'Employee', text: 'Sure, I\'ll have it ready.', translation: 'Vâng, tôi sẽ chuẩn bị xong.', order: 2, gender: 'female' },
          { speaker: 'Manager', text: 'Also, don\'t forget the team meeting at 3.', translation: 'Ngoài ra, đừng quên cuộc họp nhóm lúc 3h.', order: 3, gender: 'male' },
          { speaker: 'Employee', text: 'I\'ll be there. Should I prepare anything?', translation: 'Tôi sẽ có mặt. Tôi cần chuẩn bị gì không?', order: 4, gender: 'female' },
          { speaker: 'Manager', text: 'Please bring the project update.', translation: 'Mang theo bản cập nhật dự án nhé.', order: 5, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Let me get back to you', meaning: 'Để tôi phản hồi sau', example: 'Let me get back to you on that.', order: 1 },
          { phrase: 'I\'ll keep you posted', meaning: 'Tôi sẽ cập nhật cho bạn', example: 'I\'ll keep you posted on the progress.', order: 2 },
          { phrase: 'As per our discussion', meaning: 'Như đã thảo luận', example: 'As per our discussion, I\'ll send the files.', order: 3 },
          { phrase: 'ASAP (As Soon As Possible)', meaning: 'Càng sớm càng tốt', example: 'Please reply ASAP.', order: 4 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: SOCIAL MEDIA ============
  console.log('📱 Thêm bài học Social Media...')
  await prisma.lesson.create({
    data: {
      title: 'Social Media - Mạng xã hội',
      description: 'Từ vựng về mạng xã hội và internet',
      level: 'intermediate',
      duration: '20',
      categoryId: getCategory('daily').id,
      vocabulary: {
        create: [
          { word: 'Post', pronunciation: '/pəʊst/', meaning: 'Bài đăng', example: 'I saw your post.', order: 1 },
          { word: 'Like', pronunciation: '/laɪk/', meaning: 'Thích', example: 'Please like my photo.', order: 2 },
          { word: 'Comment', pronunciation: '/ˈkɒment/', meaning: 'Bình luận', example: 'Leave a comment below.', order: 3 },
          { word: 'Share', pronunciation: '/ʃeər/', meaning: 'Chia sẻ', example: 'Share this with your friends.', order: 4 },
          { word: 'Follow', pronunciation: '/ˈfɒləʊ/', meaning: 'Theo dõi', example: 'Follow me on Instagram.', order: 5 },
          { word: 'Subscribe', pronunciation: '/səbˈskraɪb/', meaning: 'Đăng ký', example: 'Subscribe to my channel.', order: 6 },
          { word: 'Profile', pronunciation: '/ˈprəʊfaɪl/', meaning: 'Trang cá nhân', example: 'Update your profile.', order: 7 },
          { word: 'Story', pronunciation: '/ˈstɔːri/', meaning: 'Tin nhắn 24h', example: 'Watch my story.', order: 8 },
          { word: 'Hashtag', pronunciation: '/ˈhæʃtæɡ/', meaning: 'Thẻ bài', example: 'Use relevant hashtags.', order: 9 },
          { word: 'Trending', pronunciation: '/ˈtrendɪŋ/', meaning: 'Xu hướng', example: 'This topic is trending.', order: 10 },
          { word: 'Notification', pronunciation: '/ˌnəʊtɪfɪˈkeɪʃn/', meaning: 'Thông báo', example: 'Turn on notifications.', order: 11 },
          { word: 'Viral', pronunciation: '/ˈvaɪrəl/', meaning: 'Lan truyền', example: 'The video went viral.', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Teen 1', text: 'Did you see that viral video?', translation: 'Bạn có xem video viral đó không?', order: 1, gender: 'female' },
          { speaker: 'Teen 2', text: 'Yes! I liked and shared it.', translation: 'Có! Tôi đã like và share rồi.', order: 2, gender: 'male' },
          { speaker: 'Teen 1', text: 'It\'s trending everywhere!', translation: 'Nó đang trending khắp nơi!', order: 3, gender: 'female' },
          { speaker: 'Teen 2', text: 'Follow that account, they have great content.', translation: 'Follow tài khoản đó đi, họ có nội dung hay lắm.', order: 4, gender: 'male' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Go viral', meaning: 'Lan truyền nhanh', example: 'I hope this post goes viral!', order: 1 },
          { phrase: 'Scroll through', meaning: 'Lướt xem', example: 'I was scrolling through my feed.', order: 2 },
          { phrase: 'DM me', meaning: 'Nhắn tin riêng cho tôi', example: 'DM me for more info.', order: 3 },
        ]
      }
    }
  })

  // ============ BÀI HỌC: EMERGENCY ============
  console.log('🚨 Thêm bài học Emergency...')
  await prisma.lesson.create({
    data: {
      title: 'Emergency Situations - Tình huống khẩn cấp',
      description: 'Từ vựng và cách xử lý tình huống khẩn cấp',
      level: 'intermediate',
      duration: '25',
      categoryId: getCategory('travel').id,
      vocabulary: {
        create: [
          { word: 'Emergency', pronunciation: '/ɪˈmɜːdʒənsi/', meaning: 'Khẩn cấp', example: 'Call 911 in an emergency.', order: 1 },
          { word: 'Help', pronunciation: '/help/', meaning: 'Giúp đỡ', example: 'Help! I need assistance!', order: 2 },
          { word: 'Police', pronunciation: '/pəˈliːs/', meaning: 'Cảnh sát', example: 'Call the police!', order: 3 },
          { word: 'Ambulance', pronunciation: '/ˈæmbjʊləns/', meaning: 'Xe cứu thương', example: 'We need an ambulance!', order: 4 },
          { word: 'Fire', pronunciation: '/faɪər/', meaning: 'Cháy', example: 'Fire! Everyone get out!', order: 5 },
          { word: 'Hospital', pronunciation: '/ˈhɒspɪtl/', meaning: 'Bệnh viện', example: 'Take me to the hospital.', order: 6 },
          { word: 'Accident', pronunciation: '/ˈæksɪdənt/', meaning: 'Tai nạn', example: 'There was an accident.', order: 7 },
          { word: 'Lost', pronunciation: '/lɒst/', meaning: 'Bị lạc', example: 'I\'m lost. Can you help?', order: 8 },
          { word: 'Stolen', pronunciation: '/ˈstəʊlən/', meaning: 'Bị đánh cắp', example: 'My wallet was stolen!', order: 9 },
          { word: 'Hurt', pronunciation: '/hɜːt/', meaning: 'Bị thương', example: 'I\'m hurt. Please help.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Victim', text: 'Help! Someone stole my bag!', translation: 'Cứu! Có người lấy cắp túi của tôi!', order: 1, gender: 'female' },
          { speaker: 'Helper', text: 'Calm down. Did you see who took it?', translation: 'Bình tĩnh. Bạn có thấy ai lấy không?', order: 2, gender: 'male' },
          { speaker: 'Victim', text: 'A man ran away with it!', translation: 'Một người đàn ông chạy đi với nó!', order: 3, gender: 'female' },
          { speaker: 'Helper', text: 'Let\'s call the police right away.', translation: 'Gọi cảnh sát ngay đi.', order: 4, gender: 'male' },
          { speaker: 'Victim', text: 'My passport was in there!', translation: 'Hộ chiếu của tôi ở trong đó!', order: 5, gender: 'female' },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Call for help', meaning: 'Gọi người giúp đỡ', example: 'Call for help immediately!', order: 1 },
          { phrase: 'It\'s an emergency', meaning: 'Đây là tình huống khẩn cấp', example: 'It\'s an emergency! Please hurry!', order: 2 },
          { phrase: 'I need to report...', meaning: 'Tôi cần báo...', example: 'I need to report a theft.', order: 3 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã thêm:')
  console.log('   - 10 bài học mới')
  console.log('   - 110+ từ vựng')
  console.log('   - 30+ cụm từ')
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
