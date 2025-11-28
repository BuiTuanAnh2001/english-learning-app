const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Bắt đầu thêm bài học và từ vựng mới...\n')

  // Tạo hoặc lấy categories
  console.log('📁 Kiểm tra và tạo categories...')
  const beginnerCategory = await prisma.category.upsert({
    where: { name: 'beginner' },
    update: {},
    create: {
      name: 'beginner',
      description: 'Bài học dành cho người mới bắt đầu',
      icon: '🌟'
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

  const businessCategory = await prisma.category.upsert({
    where: { name: 'business' },
    update: {},
    create: {
      name: 'business',
      description: 'Tiếng Anh kinh doanh và công sở',
      icon: '💼'
    }
  })

  const travelCategory = await prisma.category.upsert({
    where: { name: 'travel' },
    update: {},
    create: {
      name: 'travel',
      description: 'Tiếng Anh cho người đi du lịch',
      icon: '✈️'
    }
  })

  // ========== BEGINNER LESSONS ==========
  console.log('📚 Thêm bài học cơ bản...')
  
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Colors and Shapes - Màu sắc và Hình dạng',
      description: 'Học các màu sắc và hình dạng cơ bản trong tiếng Anh',
      level: 'beginner',
      duration: '15',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'Red', pronunciation: '/red/', meaning: 'Màu đỏ', example: 'The apple is red.', order: 1 },
          { word: 'Blue', pronunciation: '/bluː/', meaning: 'Màu xanh dương', example: 'The sky is blue.', order: 2 },
          { word: 'Green', pronunciation: '/ɡriːn/', meaning: 'Màu xanh lá', example: 'The grass is green.', order: 3 },
          { word: 'Yellow', pronunciation: '/ˈjeləʊ/', meaning: 'Màu vàng', example: 'The sun is yellow.', order: 4 },
          { word: 'Black', pronunciation: '/blæk/', meaning: 'Màu đen', example: 'The night is black.', order: 5 },
          { word: 'White', pronunciation: '/waɪt/', meaning: 'Màu trắng', example: 'Snow is white.', order: 6 },
          { word: 'Circle', pronunciation: '/ˈsɜːkl/', meaning: 'Hình tròn', example: 'Draw a circle.', order: 7 },
          { word: 'Square', pronunciation: '/skweər/', meaning: 'Hình vuông', example: 'A box is square.', order: 8 },
          { word: 'Triangle', pronunciation: '/ˈtraɪæŋɡl/', meaning: 'Hình tam giác', example: 'The roof is a triangle.', order: 9 },
          { word: 'Rectangle', pronunciation: '/ˈrektæŋɡl/', meaning: 'Hình chữ nhật', example: 'The door is a rectangle.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'What color is it?', meaning: 'Nó màu gì?', example: 'What color is it? - It is red.', context: 'Asking about colors', order: 1 },
          { phrase: 'It is red', meaning: 'Nó màu đỏ', example: 'The apple is red. It is red.', context: 'Describing color', order: 2 },
          { phrase: 'My favorite color is blue', meaning: 'Màu yêu thích của tôi là xanh dương', example: 'What is your favorite color? My favorite color is blue.', context: 'Expressing preference', order: 3 },
        ]
      },
      objectives: {
        create: [
          { text: 'Nhận biết và phát âm 10 màu sắc cơ bản', order: 1 },
          { text: 'Mô tả hình dạng của đồ vật', order: 2 },
          { text: 'Sử dụng màu sắc trong câu', order: 3 },
        ]
      }
    }
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Numbers and Counting - Số đếm',
      description: 'Học cách đếm số từ 1 đến 100 và các phép tính đơn giản',
      level: 'beginner',
      duration: '20',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'One', pronunciation: '/wʌn/', meaning: 'Một', example: 'I have one book.', order: 1 },
          { word: 'Two', pronunciation: '/tuː/', meaning: 'Hai', example: 'Two plus two equals four.', order: 2 },
          { word: 'Three', pronunciation: '/θriː/', meaning: 'Ba', example: 'Three cats are playing.', order: 3 },
          { word: 'Ten', pronunciation: '/ten/', meaning: 'Mười', example: 'I have ten fingers.', order: 4 },
          { word: 'Twenty', pronunciation: '/ˈtwenti/', meaning: 'Hai mươi', example: 'She is twenty years old.', order: 5 },
          { word: 'Hundred', pronunciation: '/ˈhʌndrəd/', meaning: 'Trăm', example: 'One hundred dollars.', order: 6 },
          { word: 'First', pronunciation: '/fɜːst/', meaning: 'Thứ nhất', example: 'January is the first month.', order: 7 },
          { word: 'Second', pronunciation: '/ˈsekənd/', meaning: 'Thứ hai', example: 'He came in second place.', order: 8 },
          { word: 'Half', pronunciation: '/hɑːf/', meaning: 'Một nửa', example: 'Half of the cake is gone.', order: 9 },
          { word: 'Double', pronunciation: '/ˈdʌbl/', meaning: 'Gấp đôi', example: 'Double the amount.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'How many?', meaning: 'Bao nhiêu?', usage: 'Asking about quantity', order: 1 },
          { phrase: 'Count from one to ten', meaning: 'Đếm từ một đến mười', usage: 'Giving instructions', order: 2 },
          { phrase: 'What is your phone number?', meaning: 'Số điện thoại của bạn là gì?', usage: 'Asking for contact', order: 3 },
        ]
      }
    }
  })

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'Days, Months and Seasons - Ngày tháng và Mùa',
      description: 'Học các ngày trong tuần, tháng trong năm và bốn mùa',
      level: 'beginner',
      duration: '18',
      categoryId: beginnerCategory.id,
      vocabulary: {
        create: [
          { word: 'Monday', pronunciation: '/ˈmʌndeɪ/', meaning: 'Thứ hai', example: 'I work on Monday.', order: 1 },
          { word: 'Tuesday', pronunciation: '/ˈtjuːzdeɪ/', meaning: 'Thứ ba', example: 'Tuesday is busy.', order: 2 },
          { word: 'Weekend', pronunciation: '/ˌwiːkˈend/', meaning: 'Cuối tuần', example: 'I relax on the weekend.', order: 3 },
          { word: 'January', pronunciation: '/ˈdʒænjuəri/', meaning: 'Tháng một', example: 'My birthday is in January.', order: 4 },
          { word: 'Spring', pronunciation: '/sprɪŋ/', meaning: 'Mùa xuân', example: 'Flowers bloom in spring.', order: 5 },
          { word: 'Summer', pronunciation: '/ˈsʌmər/', meaning: 'Mùa hè', example: 'Summer is very hot.', order: 6 },
          { word: 'Autumn', pronunciation: '/ˈɔːtəm/', meaning: 'Mùa thu', example: 'Leaves fall in autumn.', order: 7 },
          { word: 'Winter', pronunciation: '/ˈwɪntər/', meaning: 'Mùa đông', example: 'It snows in winter.', order: 8 },
          { word: 'Today', pronunciation: '/təˈdeɪ/', meaning: 'Hôm nay', example: 'What day is today?', order: 9 },
          { word: 'Tomorrow', pronunciation: '/təˈmɒrəʊ/', meaning: 'Ngày mai', example: 'See you tomorrow!', order: 10 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Planning the week',
            participants: ['Alice', 'Bob'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Alice', text: 'What day is it today?', translation: 'Hôm nay là thứ mấy?', order: 1, gender: 'female' },
                { speaker: 'Bob', text: 'It\'s Monday.', translation: 'Hôm nay là thứ hai.', order: 2, gender: 'male' },
                { speaker: 'Alice', text: 'Do you have plans for the weekend?', translation: 'Bạn có kế hoạch gì cho cuối tuần không?', order: 3, gender: 'female' },
                { speaker: 'Bob', text: 'Yes, I\'m going to the beach on Saturday.', translation: 'Có, tôi sẽ đi biển vào thứ bảy.', order: 4, gender: 'male' },
              ]
            }
          }
        ]
      }
    }
  })

  // ========== DAILY CONVERSATION LESSONS ==========
  console.log('💬 Thêm bài học giao tiếp hàng ngày...')

  const lesson4 = await prisma.lesson.create({
    data: {
      title: 'At the Supermarket - Ở siêu thị',
      description: 'Học cách mua sắm và giao tiếp tại siêu thị',
      level: 'intermediate',
      duration: '25',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Aisle', pronunciation: '/aɪl/', meaning: 'Lối đi (giữa các kệ hàng)', example: 'The milk is in aisle 3.', order: 1 },
          { word: 'Cart', pronunciation: '/kɑːrt/', meaning: 'Xe đẩy', example: 'Get a shopping cart.', order: 2 },
          { word: 'Checkout', pronunciation: '/ˈtʃekaʊt/', meaning: 'Quầy thanh toán', example: 'Please go to the checkout.', order: 3 },
          { word: 'Receipt', pronunciation: '/rɪˈsiːt/', meaning: 'Hóa đơn', example: 'Keep your receipt.', order: 4 },
          { word: 'Discount', pronunciation: '/ˈdɪskaʊnt/', meaning: 'Giảm giá', example: 'There\'s a 20% discount today.', order: 5 },
          { word: 'Fresh', pronunciation: '/freʃ/', meaning: 'Tươi', example: 'These vegetables are fresh.', order: 6 },
          { word: 'Frozen', pronunciation: '/ˈfrəʊzn/', meaning: 'Đông lạnh', example: 'Frozen food is in aisle 5.', order: 7 },
          { word: 'Organic', pronunciation: '/ɔːˈɡænɪk/', meaning: 'Hữu cơ', example: 'I prefer organic products.', order: 8 },
          { word: 'Expire', pronunciation: '/ɪkˈspaɪər/', meaning: 'Hết hạn', example: 'Check the expiry date.', order: 9 },
          { word: 'Refund', pronunciation: '/ˈriːfʌnd/', meaning: 'Hoàn tiền', example: 'Can I get a refund?', order: 10 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Shopping for groceries',
            participants: ['Customer', 'Staff'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Customer', text: 'Excuse me, where can I find the milk?', translation: 'Xin lỗi, tôi có thể tìm sữa ở đâu?', order: 1, gender: 'female' },
                { speaker: 'Staff', text: 'It\'s in aisle 3, on the left side.', translation: 'Nó ở lối 3, bên tay trái.', order: 2, gender: 'male' },
                { speaker: 'Customer', text: 'Thank you. Is there any discount today?', translation: 'Cảm ơn. Hôm nay có giảm giá không?', order: 3, gender: 'female' },
                { speaker: 'Staff', text: 'Yes, dairy products are 15% off.', translation: 'Có, sản phẩm từ sữa giảm 15%.', order: 4, gender: 'male' },
                { speaker: 'Customer', text: 'Great! I\'ll take two bottles.', translation: 'Tuyệt! Tôi sẽ lấy hai chai.', order: 5, gender: 'female' },
              ]
            }
          }
        ]
      },
      phrases: {
        create: [
          { phrase: 'How much does this cost?', meaning: 'Cái này giá bao nhiêu?', usage: 'Asking about price', order: 1 },
          { phrase: 'Do you accept credit cards?', meaning: 'Bạn nhận thẻ tín dụng không?', usage: 'Payment method', order: 2 },
          { phrase: 'Can I have a bag?', meaning: 'Cho tôi xin một cái túi được không?', usage: 'Requesting bag', order: 3 },
          { phrase: 'Where is the dairy section?', meaning: 'Khu sản phẩm sữa ở đâu?', usage: 'Finding location', order: 4 },
        ]
      }
    }
  })

  const lesson5 = await prisma.lesson.create({
    data: {
      title: 'At the Doctor - Khám bệnh',
      description: 'Học cách mô tả triệu chứng và giao tiếp với bác sĩ',
      level: 'intermediate',
      duration: '22',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Symptom', pronunciation: '/ˈsɪmptəm/', meaning: 'Triệu chứng', example: 'What are your symptoms?', order: 1 },
          { word: 'Headache', pronunciation: '/ˈhedeɪk/', meaning: 'Đau đầu', example: 'I have a terrible headache.', order: 2 },
          { word: 'Fever', pronunciation: '/ˈfiːvər/', meaning: 'Sốt', example: 'Do you have a fever?', order: 3 },
          { word: 'Cough', pronunciation: '/kɒf/', meaning: 'Ho', example: 'I\'ve been coughing all day.', order: 4 },
          { word: 'Prescription', pronunciation: '/prɪˈskrɪpʃn/', meaning: 'Đơn thuốc', example: 'Here is your prescription.', order: 5 },
          { word: 'Medicine', pronunciation: '/ˈmedsn/', meaning: 'Thuốc', example: 'Take this medicine twice a day.', order: 6 },
          { word: 'Appointment', pronunciation: '/əˈpɔɪntmənt/', meaning: 'Cuộc hẹn khám', example: 'I have a doctor\'s appointment.', order: 7 },
          { word: 'Allergic', pronunciation: '/əˈlɜːdʒɪk/', meaning: 'Dị ứng', example: 'I\'m allergic to penicillin.', order: 8 },
          { word: 'Pain', pronunciation: '/peɪn/', meaning: 'Đau', example: 'Where is the pain?', order: 9 },
          { word: 'Rest', pronunciation: '/rest/', meaning: 'Nghỉ ngơi', example: 'You need to rest.', order: 10 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Visiting the doctor',
            participants: ['Doctor', 'Patient'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Doctor', text: 'Good morning. What seems to be the problem?', translation: 'Chào buổi sáng. Có vấn đề gì vậy?', order: 1, gender: 'male' },
                { speaker: 'Patient', text: 'I have a bad headache and a fever.', translation: 'Tôi bị đau đầu và sốt.', order: 2, gender: 'female' },
                { speaker: 'Doctor', text: 'How long have you had these symptoms?', translation: 'Bạn có các triệu chứng này bao lâu rồi?', order: 3, gender: 'male' },
                { speaker: 'Patient', text: 'For about three days.', translation: 'Khoảng ba ngày.', order: 4, gender: 'female' },
                { speaker: 'Doctor', text: 'Let me check your temperature. Please open your mouth.', translation: 'Để tôi kiểm tra nhiệt độ. Vui lòng há miệng.', order: 5, gender: 'male' },
              ]
            }
          }
        ]
      }
    }
  })

  const lesson6 = await prisma.lesson.create({
    data: {
      title: 'Making Phone Calls - Gọi điện thoại',
      description: 'Học cách gọi điện thoại chuyên nghiệp và lịch sự',
      level: 'intermediate',
      duration: '20',
      categoryId: dailyCategory.id,
      vocabulary: {
        create: [
          { word: 'Dial', pronunciation: '/daɪəl/', meaning: 'Quay số', example: 'Dial the number.', order: 1 },
          { word: 'Extension', pronunciation: '/ɪkˈstenʃn/', meaning: 'Số máy lẻ', example: 'Extension 205, please.', order: 2 },
          { word: 'Hold', pronunciation: '/həʊld/', meaning: 'Giữ máy', example: 'Please hold the line.', order: 3 },
          { word: 'Voicemail', pronunciation: '/ˈvɔɪsmeɪl/', meaning: 'Thư thoại', example: 'Leave a voicemail.', order: 4 },
          { word: 'Busy', pronunciation: '/ˈbɪzi/', meaning: 'Bận', example: 'The line is busy.', order: 5 },
          { word: 'Transfer', pronunciation: '/trænsˈfɜːr/', meaning: 'Chuyển máy', example: 'I\'ll transfer you.', order: 6 },
          { word: 'Reception', pronunciation: '/rɪˈsepʃn/', meaning: 'Lễ tân', example: 'Call reception first.', order: 7 },
          { word: 'Message', pronunciation: '/ˈmesɪdʒ/', meaning: 'Tin nhắn', example: 'Can I leave a message?', order: 8 },
          { word: 'Available', pronunciation: '/əˈveɪləbl/', meaning: 'Có sẵn', example: 'Is he available?', order: 9 },
          { word: 'Return call', pronunciation: '/rɪˈtɜːrn kɔːl/', meaning: 'Gọi lại', example: 'I\'ll return your call.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'May I speak to...?', meaning: 'Tôi có thể nói chuyện với...?', usage: 'Asking to speak', order: 1 },
          { phrase: 'Who is calling?', meaning: 'Ai đang gọi?', usage: 'Identifying caller', order: 2 },
          { phrase: 'Please hold on', meaning: 'Vui lòng giữ máy', usage: 'Asking to wait', order: 3 },
          { phrase: 'I\'ll put you through', meaning: 'Tôi sẽ chuyển máy cho bạn', usage: 'Transferring call', order: 4 },
        ]
      }
    }
  })

  // ========== BUSINESS LESSONS ==========
  console.log('💼 Thêm bài học tiếng Anh thương mại...')

  const lesson7 = await prisma.lesson.create({
    data: {
      title: 'Business Meetings - Họp công việc',
      description: 'Học từ vựng và cách giao tiếp trong cuộc họp kinh doanh',
      level: 'advanced',
      duration: '30',
      categoryId: businessCategory.id,
      vocabulary: {
        create: [
          { word: 'Agenda', pronunciation: '/əˈdʒendə/', meaning: 'Chương trình họp', example: 'Let\'s go through the agenda.', order: 1 },
          { word: 'Minutes', pronunciation: '/ˈmɪnɪts/', meaning: 'Biên bản họp', example: 'Please take the minutes.', order: 2 },
          { word: 'Proposal', pronunciation: '/prəˈpəʊzl/', meaning: 'Đề xuất', example: 'I have a proposal.', order: 3 },
          { word: 'Budget', pronunciation: '/ˈbʌdʒɪt/', meaning: 'Ngân sách', example: 'What is the budget?', order: 4 },
          { word: 'Deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'Thời hạn', example: 'The deadline is Friday.', order: 5 },
          { word: 'Stakeholder', pronunciation: '/ˈsteɪkhəʊldər/', meaning: 'Bên liên quan', example: 'Inform all stakeholders.', order: 6 },
          { word: 'Revenue', pronunciation: '/ˈrevənjuː/', meaning: 'Doanh thu', example: 'Revenue increased by 20%.', order: 7 },
          { word: 'Negotiate', pronunciation: '/nɪˈɡəʊʃieɪt/', meaning: 'Đàm phán', example: 'We need to negotiate the price.', order: 8 },
          { word: 'Contract', pronunciation: '/ˈkɒntrækt/', meaning: 'Hợp đồng', example: 'Sign the contract.', order: 9 },
          { word: 'Merger', pronunciation: '/ˈmɜːrdʒər/', meaning: 'Sáp nhập', example: 'The merger is complete.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Let\'s get started', meaning: 'Hãy bắt đầu', usage: 'Opening meeting', order: 1 },
          { phrase: 'I\'d like to propose', meaning: 'Tôi muốn đề xuất', usage: 'Making suggestion', order: 2 },
          { phrase: 'Could you clarify?', meaning: 'Bạn có thể làm rõ?', usage: 'Asking for explanation', order: 3 },
          { phrase: 'To sum up', meaning: 'Tóm lại', usage: 'Summarizing', order: 4 },
        ]
      }
    }
  })

  const lesson8 = await prisma.lesson.create({
    data: {
      title: 'Email Writing - Viết email công việc',
      description: 'Học cách viết email chuyên nghiệp và hiệu quả',
      level: 'intermediate',
      duration: '25',
      categoryId: businessCategory.id,
      vocabulary: {
        create: [
          { word: 'Subject line', pronunciation: '/ˈsʌbdʒɪkt laɪn/', meaning: 'Tiêu đề email', example: 'Write a clear subject line.', order: 1 },
          { word: 'Attachment', pronunciation: '/əˈtætʃmənt/', meaning: 'Tệp đính kèm', example: 'Please see the attachment.', order: 2 },
          { word: 'Recipient', pronunciation: '/rɪˈsɪpiənt/', meaning: 'Người nhận', example: 'Who is the recipient?', order: 3 },
          { word: 'Regards', pronunciation: '/rɪˈɡɑːrdz/', meaning: 'Trân trọng', example: 'Best regards, John.', order: 4 },
          { word: 'Follow up', pronunciation: '/ˈfɒləʊ ʌp/', meaning: 'Theo dõi', example: 'I\'m following up on my email.', order: 5 },
          { word: 'Acknowledge', pronunciation: '/əkˈnɒlɪdʒ/', meaning: 'Xác nhận', example: 'Please acknowledge receipt.', order: 6 },
          { word: 'Urgent', pronunciation: '/ˈɜːrdʒənt/', meaning: 'Khẩn cấp', example: 'This is urgent.', order: 7 },
          { word: 'Confidential', pronunciation: '/ˌkɒnfɪˈdenʃl/', meaning: 'Bí mật', example: 'This email is confidential.', order: 8 },
          { word: 'Reply', pronunciation: '/rɪˈplaɪ/', meaning: 'Trả lời', example: 'Please reply by Friday.', order: 9 },
          { word: 'Forward', pronunciation: '/ˈfɔːrwərd/', meaning: 'Chuyển tiếp', example: 'Forward this to the team.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'I am writing to', meaning: 'Tôi viết thư để', usage: 'Email opening', order: 1 },
          { phrase: 'Thank you for your email', meaning: 'Cảm ơn email của bạn', usage: 'Acknowledging', order: 2 },
          { phrase: 'Please find attached', meaning: 'Vui lòng xem tệp đính kèm', usage: 'Mentioning attachment', order: 3 },
          { phrase: 'I look forward to hearing from you', meaning: 'Tôi mong nhận được phản hồi', usage: 'Email closing', order: 4 },
        ]
      }
    }
  })

  // ========== TRAVEL LESSONS ==========
  console.log('✈️ Thêm bài học du lịch...')

  const lesson9 = await prisma.lesson.create({
    data: {
      title: 'At the Hotel - Ở khách sạn',
      description: 'Học cách đặt phòng và giao tiếp tại khách sạn',
      level: 'intermediate',
      duration: '23',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezərˈveɪʃn/', meaning: 'Đặt phòng', example: 'I have a reservation.', order: 1 },
          { word: 'Check-in', pronunciation: '/ˈtʃek ɪn/', meaning: 'Nhận phòng', example: 'Check-in time is 2 PM.', order: 2 },
          { word: 'Check-out', pronunciation: '/ˈtʃek aʊt/', meaning: 'Trả phòng', example: 'Check-out is at 11 AM.', order: 3 },
          { word: 'Suite', pronunciation: '/swiːt/', meaning: 'Phòng suite', example: 'I booked a suite.', order: 4 },
          { word: 'Amenities', pronunciation: '/əˈmenətiz/', meaning: 'Tiện nghi', example: 'What amenities do you offer?', order: 5 },
          { word: 'Concierge', pronunciation: '/ˌkɒnsiˈeəʒ/', meaning: 'Nhân viên phục vụ', example: 'Ask the concierge.', order: 6 },
          { word: 'Housekeeping', pronunciation: '/ˈhaʊskiːpɪŋ/', meaning: 'Dọn phòng', example: 'Call housekeeping.', order: 7 },
          { word: 'Complimentary', pronunciation: '/ˌkɒmplɪˈmentri/', meaning: 'Miễn phí', example: 'Breakfast is complimentary.', order: 8 },
          { word: 'Luggage', pronunciation: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý', example: 'Where is my luggage?', order: 9 },
          { word: 'Wi-Fi', pronunciation: '/ˈwaɪfaɪ/', meaning: 'Wifi', example: 'What\'s the Wi-Fi password?', order: 10 },
        ]
      },
      dialogues: {
        create: [
          {
            title: 'Hotel check-in',
            participants: ['Guest', 'Receptionist'],
            order: 1,
            lines: {
              create: [
                { speaker: 'Guest', text: 'Good evening. I have a reservation under the name Smith.', translation: 'Chào buổi tối. Tôi có đặt phòng dưới tên Smith.', order: 1, gender: 'male' },
                { speaker: 'Receptionist', text: 'Welcome, Mr. Smith. Let me check... Yes, a deluxe room for three nights.', translation: 'Chào mừng ông Smith. Để tôi kiểm tra... Vâng, phòng deluxe ba đêm.', order: 2, gender: 'female' },
                { speaker: 'Guest', text: 'That\'s correct. Does the room have Wi-Fi?', translation: 'Đúng rồi. Phòng có Wi-Fi không?', order: 3, gender: 'male' },
                { speaker: 'Receptionist', text: 'Yes, complimentary Wi-Fi is available. Here is your key card.', translation: 'Có, Wi-Fi miễn phí. Đây là thẻ chìa khóa của ông.', order: 4, gender: 'female' },
              ]
            }
          }
        ]
      }
    }
  })

  const lesson10 = await prisma.lesson.create({
    data: {
      title: 'Airport and Flight - Sân bay và Chuyến bay',
      description: 'Học từ vựng cần thiết tại sân bay và trên máy bay',
      level: 'intermediate',
      duration: '28',
      categoryId: travelCategory.id,
      vocabulary: {
        create: [
          { word: 'Boarding pass', pronunciation: '/ˈbɔːrdɪŋ pɑːs/', meaning: 'Thẻ lên máy bay', example: 'Show your boarding pass.', order: 1 },
          { word: 'Gate', pronunciation: '/ɡeɪt/', meaning: 'Cổng lên máy bay', example: 'Go to gate 15.', order: 2 },
          { word: 'Departure', pronunciation: '/dɪˈpɑːrtʃər/', meaning: 'Khởi hành', example: 'Departure time is 10 AM.', order: 3 },
          { word: 'Arrival', pronunciation: '/əˈraɪvl/', meaning: 'Đến nơi', example: 'Arrival is at 2 PM.', order: 4 },
          { word: 'Customs', pronunciation: '/ˈkʌstəmz/', meaning: 'Hải quan', example: 'Go through customs.', order: 5 },
          { word: 'Immigration', pronunciation: '/ˌɪmɪˈɡreɪʃn/', meaning: 'Xuất nhập cảnh', example: 'Pass immigration first.', order: 6 },
          { word: 'Baggage claim', pronunciation: '/ˈbæɡɪdʒ kleɪm/', meaning: 'Khu lấy hành lý', example: 'Meet at baggage claim.', order: 7 },
          { word: 'Aisle', pronunciation: '/aɪl/', meaning: 'Lối đi', example: 'Aisle seat, please.', order: 8 },
          { word: 'Turbulence', pronunciation: '/ˈtɜːrbjələns/', meaning: 'Nhiễu động', example: 'Expect some turbulence.', order: 9 },
          { word: 'Layover', pronunciation: '/ˈleɪəʊvər/', meaning: 'Dừng chuyến', example: 'Two-hour layover in Dubai.', order: 10 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Where is the check-in counter?', meaning: 'Quầy check-in ở đâu?', usage: 'Finding location', order: 1 },
          { phrase: 'Window or aisle?', meaning: 'Cửa sổ hay lối đi?', usage: 'Seat preference', order: 2 },
          { phrase: 'How many bags are you checking?', meaning: 'Bạn gửi bao nhiêu túi?', usage: 'Luggage question', order: 3 },
          { phrase: 'Final boarding call', meaning: 'Thông báo lên máy bay lần cuối', usage: 'Announcement', order: 4 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã thêm 10 bài học mới với:')
  console.log('   - 100+ từ vựng mới')
  console.log('   - 30+ cụm từ thông dụng')
  console.log('   - 5+ đoạn hội thoại thực tế')
  console.log('   - Bao gồm: Cơ bản, Giao tiếp, Kinh doanh, Du lịch\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
