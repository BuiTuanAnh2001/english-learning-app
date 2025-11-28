const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Thêm nội dung phong phú vào database...\n')

  // Categories
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

  // LESSON 1: Restaurant - Full conversation
  console.log('📚 Lesson 1: Restaurant Dining (20 từ, 10 cụm từ, 8 hội thoại)...')
  await prisma.lesson.create({
    data: {
      title: 'Dining at a Restaurant - Ăn tại nhà hàng',
      description: 'Học cách giao tiếp hoàn chỉnh từ đặt bàn đến thanh toán tại nhà hàng',
      level: 'intermediate',
      duration: '35 phút',
      categoryId: daily.id,
      vocabulary: {
        create: [
          { word: 'Reservation', pronunciation: '/ˌrezərˈveɪʃn/', meaning: 'Đặt bàn trước', example: 'I have a reservation for two at 7 PM.', order: 1 },
          { word: 'Menu', pronunciation: '/ˈmenjuː/', meaning: 'Thực đơn', example: 'May I see the menu, please?', order: 2 },
          { word: 'Appetizer', pronunciation: '/ˈæpɪtaɪzər/', meaning: 'Món khai vị', example: 'I\'ll have the soup as an appetizer.', order: 3 },
          { word: 'Main course', pronunciation: '/meɪn kɔːrs/', meaning: 'Món chính', example: 'For the main course, I\'d like the grilled salmon.', order: 4 },
          { word: 'Dessert', pronunciation: '/dɪˈzɜːrt/', meaning: 'Món tráng miệng', example: 'Would you like dessert?', order: 5 },
          { word: 'Beverage', pronunciation: '/ˈbevərɪdʒ/', meaning: 'Đồ uống', example: 'What beverages do you have?', order: 6 },
          { word: 'Rare', pronunciation: '/reər/', meaning: 'Tái (độ chín)', example: 'I\'d like my steak rare, please.', order: 7 },
          { word: 'Medium', pronunciation: '/ˈmiːdiəm/', meaning: 'Vừa (độ chín)', example: 'Cook it medium, please.', order: 8 },
          { word: 'Well-done', pronunciation: '/wel dʌn/', meaning: 'Chín kỹ', example: 'I prefer my meat well-done.', order: 9 },
          { word: 'Bill/Check', pronunciation: '/bɪl/ /tʃek/', meaning: 'Hóa đơn', example: 'Can I have the bill, please?', order: 10 },
          { word: 'Tip', pronunciation: '/tɪp/', meaning: 'Tiền boa', example: 'Is the tip included?', order: 11 },
          { word: 'Delicious', pronunciation: '/dɪˈlɪʃəs/', meaning: 'Ngon', example: 'This dish is absolutely delicious!', order: 12 },
          { word: 'Spicy', pronunciation: '/ˈspaɪsi/', meaning: 'Cay', example: 'Is this dish very spicy?', order: 13 },
          { word: 'Portion', pronunciation: '/ˈpɔːrʃn/', meaning: 'Phần ăn', example: 'The portions here are very generous.', order: 14 },
          { word: 'Recommend', pronunciation: '/ˌrekəˈmend/', meaning: 'Gợi ý, đề xuất', example: 'What do you recommend?', order: 15 },
          { word: 'Waiter/Waitress', pronunciation: '/ˈweɪtər/ /ˈweɪtrəs/', meaning: 'Phục vụ nam/nữ', example: 'Excuse me, waiter!', order: 16 },
          { word: 'Chef', pronunciation: '/ʃef/', meaning: 'Đầu bếp', example: 'My compliments to the chef!', order: 17 },
          { word: 'Vegetarian', pronunciation: '/ˌvedʒəˈteəriən/', meaning: 'Người ăn chay', example: 'Do you have vegetarian options?', order: 18 },
          { word: 'Allergic', pronunciation: '/əˈlɜːrdʒɪk/', meaning: 'Dị ứng', example: 'I\'m allergic to peanuts.', order: 19 },
          { word: 'Takeout', pronunciation: '/ˈteɪkaʊt/', meaning: 'Mang về', example: 'Can I get this as takeout?', order: 20 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Table for two, please', meaning: 'Cho tôi bàn hai người', example: 'Table for two, please. - Right this way.', context: 'Requesting table', order: 1 },
          { phrase: 'I\'d like to order', meaning: 'Tôi muốn gọi món', example: 'I\'d like to order the pasta, please.', context: 'Ordering food', order: 2 },
          { phrase: 'How would you like it cooked?', meaning: 'Bạn muốn nấu như thế nào?', example: 'How would you like your steak cooked? - Medium rare, please.', context: 'Asking preference', order: 3 },
          { phrase: 'Can I have the check?', meaning: 'Cho tôi xin hóa đơn', example: 'Can I have the check, please? - Certainly.', context: 'Requesting bill', order: 4 },
          { phrase: 'Keep the change', meaning: 'Giữ tiền thừa', example: 'Here\'s 50 dollars. Keep the change.', context: 'Giving tip', order: 5 },
          { phrase: 'This looks great', meaning: 'Trông ngon quá', example: 'This looks great! Thank you.', context: 'Complimenting food', order: 6 },
          { phrase: 'I\'ll have the same', meaning: 'Cho tôi món giống vậy', example: 'I\'ll have the same as him, please.', context: 'Ordering same dish', order: 7 },
          { phrase: 'Is everything okay?', meaning: 'Mọi thứ ổn chứ?', example: 'Is everything okay with your meal? - Yes, perfect!', context: 'Checking satisfaction', order: 8 },
          { phrase: 'Would you like anything else?', meaning: 'Quý khách cần gì thêm không?', example: 'Would you like anything else? - No, thank you.', context: 'Offering more', order: 9 },
          { phrase: 'Enjoy your meal', meaning: 'Chúc ngon miệng', example: 'Here\'s your food. Enjoy your meal!', context: 'Serving food', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Host', text: 'Good evening! Do you have a reservation?', translation: 'Chào buổi tối! Quý khách có đặt bàn trước không?', gender: 'female', order: 1 },
          { speaker: 'Customer', text: 'Yes, under the name Johnson, for two people at 7:30.', translation: 'Có, tên Johnson, hai người lúc 7:30.', gender: 'male', order: 2 },
          { speaker: 'Host', text: 'Perfect! Right this way, please. Here\'s your table.', translation: 'Hoàn hảo! Mời đi lối này. Đây là bàn của quý khách.', gender: 'female', order: 3 },
          { speaker: 'Waiter', text: 'Good evening! I\'m Tom, I\'ll be your server tonight. Can I get you started with some drinks?', translation: 'Chào buổi tối! Tôi là Tom, tôi sẽ phục vụ quý khách tối nay. Tôi có thể mang đồ uống trước không?', gender: 'male', order: 4 },
          { speaker: 'Customer', text: 'Yes, I\'ll have a glass of white wine, please.', translation: 'Vâng, cho tôi một ly rượu vang trắng.', gender: 'female', order: 5 },
          { speaker: 'Waiter', text: 'Excellent choice! And for you, sir?', translation: 'Lựa chọn tuyệt vời! Còn ông thì sao?', gender: 'male', order: 6 },
          { speaker: 'Customer 2', text: 'Just water for me, thanks.', translation: 'Cho tôi nước lọc thôi, cảm ơn.', gender: 'male', order: 7 },
          { speaker: 'Waiter', text: 'Are you ready to order, or would you like a few more minutes?', translation: 'Quý khách đã sẵn sàng gọi món chưa, hay cần thêm vài phút?', gender: 'male', order: 8 },
          { speaker: 'Customer', text: 'What do you recommend?', translation: 'Bạn gợi ý món gì?', gender: 'female', order: 9 },
          { speaker: 'Waiter', text: 'Our grilled salmon is excellent today, and the ribeye steak is always popular.', translation: 'Cá hồi nướng của chúng tôi hôm nay rất tuyệt, và bít tết sườn luôn được ưa chuộng.', gender: 'male', order: 10 },
          { speaker: 'Customer', text: 'I\'ll have the salmon, please. How is it prepared?', translation: 'Cho tôi món cá hồi. Nó được chế biến như thế nào?', gender: 'female', order: 11 },
          { speaker: 'Waiter', text: 'It\'s grilled with herbs and served with roasted vegetables and rice.', translation: 'Nó được nướng với thảo mộc và ăn kèm với rau nướng và cơm.', gender: 'male', order: 12 },
          { speaker: 'Customer 2', text: 'And I\'ll have the ribeye steak, medium-rare, please.', translation: 'Còn tôi sẽ lấy bít tết sườn, tái vừa.', gender: 'male', order: 13 },
          { speaker: 'Waiter', text: 'Perfect! Your order will be ready in about 20 minutes.', translation: 'Hoàn hảo! Món của quý khách sẽ sẵn sàng trong khoảng 20 phút.', gender: 'male', order: 14 },
          { speaker: 'Waiter', text: 'Here are your meals. Please be careful, the plates are hot. Enjoy!', translation: 'Đây là món ăn của quý khách. Xin cẩn thận, đĩa nóng. Chúc ngon miệng!', gender: 'male', order: 15 },
          { speaker: 'Customer', text: 'This looks amazing! Thank you.', translation: 'Trông tuyệt vời quá! Cảm ơn.', gender: 'female', order: 16 },
          { speaker: 'Waiter', text: 'Is everything to your satisfaction?', translation: 'Mọi thứ có hài lòng không ạ?', gender: 'male', order: 17 },
          { speaker: 'Customer 2', text: 'Yes, it\'s delicious! My compliments to the chef.', translation: 'Vâng, rất ngon! Xin khen ngợi đầu bếp.', gender: 'male', order: 18 },
          { speaker: 'Waiter', text: 'I\'ll let him know! Would you like to see the dessert menu?', translation: 'Tôi sẽ cho anh ấy biết! Quý khách có muốn xem menu tráng miệng không?', gender: 'male', order: 19 },
          { speaker: 'Customer', text: 'No, thank you. Can we have the check, please?', translation: 'Không, cảm ơn. Cho chúng tôi xin hóa đơn.', gender: 'female', order: 20 },
        ]
      }
    }
  })

  // LESSON 2: Airport & Travel
  console.log('📚 Lesson 2: Airport & Flight (18 từ, 10 cụm từ, 15 hội thoại)...')
  await prisma.lesson.create({
    data: {
      title: 'Airport and Flight - Sân bay và Chuyến bay',
      description: 'Tất cả từ vựng và tình huống cần thiết tại sân bay và trên máy bay',
      level: 'intermediate',
      duration: '40 phút',
      categoryId: travel.id,
      vocabulary: {
        create: [
          { word: 'Boarding pass', pronunciation: '/ˈbɔːrdɪŋ pɑːs/', meaning: 'Thẻ lên máy bay', example: 'Please show your boarding pass.', order: 1 },
          { word: 'Gate', pronunciation: '/ɡeɪt/', meaning: 'Cổng lên máy bay', example: 'Your flight departs from gate 15.', order: 2 },
          { word: 'Departure', pronunciation: '/dɪˈpɑːrtʃər/', meaning: 'Khởi hành', example: 'The departure time is 10 AM.', order: 3 },
          { word: 'Arrival', pronunciation: '/əˈraɪvl/', meaning: 'Đến nơi', example: 'Our arrival time is 2 PM.', order: 4 },
          { word: 'Check-in', pronunciation: '/ˈtʃek ɪn/', meaning: 'Làm thủ tục', example: 'Check-in opens 3 hours before departure.', order: 5 },
          { word: 'Customs', pronunciation: '/ˈkʌstəmz/', meaning: 'Hải quan', example: 'Please go through customs.', order: 6 },
          { word: 'Immigration', pronunciation: '/ˌɪmɪˈɡreɪʃn/', meaning: 'Xuất nhập cảnh', example: 'Show your passport at immigration.', order: 7 },
          { word: 'Baggage claim', pronunciation: '/ˈbæɡɪdʒ kleɪm/', meaning: 'Khu lấy hành lý', example: 'Meet me at baggage claim.', order: 8 },
          { word: 'Carry-on', pronunciation: '/ˈkæri ɒn/', meaning: 'Hành lý xách tay', example: 'This bag is my carry-on.', order: 9 },
          { word: 'Checked luggage', pronunciation: '/tʃekt ˈlʌɡɪdʒ/', meaning: 'Hành lý ký gửi', example: 'I have one checked luggage.', order: 10 },
          { word: 'Aisle seat', pronunciation: '/aɪl siːt/', meaning: 'Ghế lối đi', example: 'I prefer an aisle seat.', order: 11 },
          { word: 'Window seat', pronunciation: '/ˈwɪndəʊ siːt/', meaning: 'Ghế cạnh cửa sổ', example: 'Can I have a window seat?', order: 12 },
          { word: 'Turbulence', pronunciation: '/ˈtɜːrbjələns/', meaning: 'Nhiễu động không khí', example: 'Please fasten your seatbelt during turbulence.', order: 13 },
          { word: 'Layover', pronunciation: '/ˈleɪəʊvər/', meaning: 'Dừng chuyến', example: 'We have a 2-hour layover in Dubai.', order: 14 },
          { word: 'Delayed', pronunciation: '/dɪˈleɪd/', meaning: 'Bị hoãn', example: 'The flight is delayed by 30 minutes.', order: 15 },
          { word: 'Cancelled', pronunciation: '/ˈkænsəld/', meaning: 'Bị hủy', example: 'The flight has been cancelled.', order: 16 },
          { word: 'Terminal', pronunciation: '/ˈtɜːrmɪnl/', meaning: 'Nhà ga', example: 'Which terminal is my flight in?', order: 17 },
          { word: 'Security check', pronunciation: '/sɪˈkjʊərəti tʃek/', meaning: 'Kiểm tra an ninh', example: 'Please remove your laptop at security check.', order: 18 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Where is the check-in counter?', meaning: 'Quầy check-in ở đâu?', example: 'Excuse me, where is the check-in counter for flight BA123?', context: 'Finding location', order: 1 },
          { phrase: 'Window or aisle?', meaning: 'Cửa sổ hay lối đi?', example: 'Window or aisle seat? - Aisle, please.', context: 'Seat preference', order: 2 },
          { phrase: 'How many bags are you checking?', meaning: 'Bạn ký gửi mấy túi?', example: 'How many bags are you checking? - Just one.', context: 'Luggage question', order: 3 },
          { phrase: 'Final boarding call', meaning: 'Thông báo lên máy bay lần cuối', example: 'This is the final boarding call for flight 123.', context: 'Announcement', order: 4 },
          { phrase: 'Fasten your seatbelt', meaning: 'Thắt dây an toàn', example: 'Please fasten your seatbelt for takeoff.', context: 'Safety instruction', order: 5 },
          { phrase: 'Anything to declare?', meaning: 'Có gì cần khai báo không?', example: 'Anything to declare? - No, nothing.', context: 'Customs question', order: 6 },
          { phrase: 'May I see your passport?', meaning: 'Cho xem hộ chiếu', example: 'May I see your passport and boarding pass?', context: 'Document check', order: 7 },
          { phrase: 'Please proceed to gate', meaning: 'Vui lòng đến cổng', example: 'Please proceed to gate 15 for boarding.', context: 'Direction', order: 8 },
          { phrase: 'How long is the flight?', meaning: 'Chuyến bay bao lâu?', example: 'How long is the flight to London? - About 7 hours.', context: 'Flight duration', order: 9 },
          { phrase: 'I\'d like to upgrade', meaning: 'Tôi muốn nâng hạng', example: 'I\'d like to upgrade to business class.', context: 'Requesting upgrade', order: 10 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Agent', text: 'Good morning! May I see your passport and ticket?', translation: 'Chào buổi sáng! Cho tôi xem hộ chiếu và vé của bạn?', gender: 'female', order: 1 },
          { speaker: 'Passenger', text: 'Here you go.', translation: 'Của bạn đây.', gender: 'male', order: 2 },
          { speaker: 'Agent', text: 'Thank you. Are you checking any luggage today?', translation: 'Cảm ơn. Hôm nay bạn có ký gửi hành lý không?', gender: 'female', order: 3 },
          { speaker: 'Passenger', text: 'Yes, I have one suitcase.', translation: 'Có, tôi có một vali.', gender: 'male', order: 4 },
          { speaker: 'Agent', text: 'Please place it on the scale. Did you pack this bag yourself?', translation: 'Vui lòng đặt nó lên cân. Bạn tự đóng gói túi này chứ?', gender: 'female', order: 5 },
          { speaker: 'Passenger', text: 'Yes, I did.', translation: 'Vâng, tôi tự đóng.', gender: 'male', order: 6 },
          { speaker: 'Agent', text: 'Does it contain any prohibited items?', translation: 'Nó có chứa đồ vật bị cấm không?', gender: 'female', order: 7 },
          { speaker: 'Passenger', text: 'No, it doesn\'t.', translation: 'Không.', gender: 'male', order: 8 },
          { speaker: 'Agent', text: 'Would you prefer a window or aisle seat?', translation: 'Bạn muốn ghế cửa sổ hay lối đi?', gender: 'female', order: 9 },
          { speaker: 'Passenger', text: 'Window seat, please.', translation: 'Ghế cửa sổ.', gender: 'male', order: 10 },
          { speaker: 'Agent', text: 'Perfect! Here\'s your boarding pass. You\'re in seat 15A. Boarding begins at 9:30 at gate 12.', translation: 'Hoàn hảo! Đây là thẻ lên máy bay. Bạn ở ghế 15A. Lên máy bay lúc 9:30 tại cổng 12.', gender: 'female', order: 11 },
          { speaker: 'Passenger', text: 'Thank you. Where is gate 12?', translation: 'Cảm ơn. Cổng 12 ở đâu?', gender: 'male', order: 12 },
          { speaker: 'Agent', text: 'After security, turn right and it\'s down the hall. Have a pleasant flight!', translation: 'Sau khi qua kiểm tra an ninh, rẽ phải và đi xuống hành lang. Chúc chuyến bay vui vẻ!', gender: 'female', order: 13 },
          { speaker: 'Flight Attendant', text: 'Welcome aboard! Can I help you with your bag?', translation: 'Chào mừng lên máy bay! Tôi có thể giúp bạn với túi xách không?', gender: 'female', order: 14 },
          { speaker: 'Passenger', text: 'Yes, please. Where should I put it?', translation: 'Vâng. Tôi nên đặt nó ở đâu?', gender: 'male', order: 15 },
        ]
      }
    }
  })

  // LESSON 3: Business English
  console.log('📚 Lesson 3: Business Meetings (20 từ, 12 cụm từ, 12 hội thoại)...')
  await prisma.lesson.create({
    data: {
      title: 'Business Meetings & Negotiations - Họp và Đàm phán',
      description: 'Tiếng Anh chuyên nghiệp cho môi trường công sở và cuộc họp',
      level: 'advanced',
      duration: '45 phút',
      categoryId: business.id,
      vocabulary: {
        create: [
          { word: 'Agenda', pronunciation: '/əˈdʒendə/', meaning: 'Chương trình họp', example: 'Let\'s go through the agenda for today.', order: 1 },
          { word: 'Minutes', pronunciation: '/ˈmɪnɪts/', meaning: 'Biên bản họp', example: 'Who will take the minutes?', order: 2 },
          { word: 'Proposal', pronunciation: '/prəˈpəʊzl/', meaning: 'Đề xuất', example: 'I have a proposal to increase efficiency.', order: 3 },
          { word: 'Budget', pronunciation: '/ˈbʌdʒɪt/', meaning: 'Ngân sách', example: 'What is the budget for this project?', order: 4 },
          { word: 'Deadline', pronunciation: '/ˈdedlaɪn/', meaning: 'Thời hạn', example: 'The deadline is next Friday.', order: 5 },
          { word: 'Stakeholder', pronunciation: '/ˈsteɪkhəʊldər/', meaning: 'Bên liên quan', example: 'We need to consult all stakeholders.', order: 6 },
          { word: 'Revenue', pronunciation: '/ˈrevənjuː/', meaning: 'Doanh thu', example: 'Our revenue increased by 20%.', order: 7 },
          { word: 'Profit margin', pronunciation: '/ˈprɒfɪt ˈmɑːrdʒɪn/', meaning: 'Tỷ suất lợi nhuận', example: 'We need to improve our profit margin.', order: 8 },
          { word: 'Negotiate', pronunciation: '/nɪˈɡəʊʃieɪt/', meaning: 'Đàm phán', example: 'We need to negotiate better terms.', order: 9 },
          { word: 'Contract', pronunciation: '/ˈkɒntrækt/', meaning: 'Hợp đồng', example: 'Please review the contract carefully.', order: 10 },
          { word: 'Merger', pronunciation: '/ˈmɜːrdʒər/', meaning: 'Sáp nhập', example: 'The merger will be completed next month.', order: 11 },
          { word: 'Acquisition', pronunciation: '/ˌækwɪˈzɪʃn/', meaning: 'Mua lại', example: 'The acquisition was successful.', order: 12 },
          { word: 'Quarter', pronunciation: '/ˈkwɔːrtər/', meaning: 'Quý (3 tháng)', example: 'Sales improved this quarter.', order: 13 },
          { word: 'ROI (Return on Investment)', pronunciation: '/ɑːr əʊ aɪ/', meaning: 'Lợi nhuận đầu tư', example: 'What\'s the expected ROI?', order: 14 },
          { word: 'Benchmark', pronunciation: '/ˈbentʃmɑːrk/', meaning: 'Tiêu chuẩn đánh giá', example: 'We exceeded the industry benchmark.', order: 15 },
          { word: 'Forecast', pronunciation: '/ˈfɔːrkɑːst/', meaning: 'Dự báo', example: 'The forecast looks positive.', order: 16 },
          { word: 'Milestone', pronunciation: '/ˈmaɪlstəʊn/', meaning: 'Cột mốc quan trọng', example: 'We\'ve reached an important milestone.', order: 17 },
          { word: 'Deliverable', pronunciation: '/dɪˈlɪvərəbl/', meaning: 'Kết quả cần giao', example: 'What are the key deliverables?', order: 18 },
          { word: 'Action item', pronunciation: '/ˈækʃn ˈaɪtəm/', meaning: 'Nhiệm vụ cần làm', example: 'Let\'s review the action items.', order: 19 },
          { word: 'Follow-up', pronunciation: '/ˈfɒləʊ ʌp/', meaning: 'Theo dõi, tiếp theo', example: 'I\'ll follow up with you tomorrow.', order: 20 },
        ]
      },
      phrases: {
        create: [
          { phrase: 'Let\'s get started', meaning: 'Bắt đầu thôi', example: 'Good morning everyone. Let\'s get started.', context: 'Opening meeting', order: 1 },
          { phrase: 'I\'d like to propose', meaning: 'Tôi muốn đề xuất', example: 'I\'d like to propose a new marketing strategy.', context: 'Making suggestion', order: 2 },
          { phrase: 'Could you clarify?', meaning: 'Bạn có thể làm rõ?', example: 'Could you clarify what you mean by that?', context: 'Asking explanation', order: 3 },
          { phrase: 'To sum up', meaning: 'Tóm lại', example: 'To sum up, we need to increase our budget.', context: 'Summarizing', order: 4 },
          { phrase: 'Moving forward', meaning: 'Tiến về phía trước', example: 'Moving forward, we\'ll implement these changes.', context: 'Future action', order: 5 },
          { phrase: 'Circle back', meaning: 'Quay lại thảo luận', example: 'Let\'s circle back to this later.', context: 'Postponing discussion', order: 6 },
          { phrase: 'On the same page', meaning: 'Cùng hiểu biết', example: 'Let\'s make sure we\'re all on the same page.', context: 'Ensuring understanding', order: 7 },
          { phrase: 'Touch base', meaning: 'Liên lạc nhanh', example: 'Let\'s touch base next week.', context: 'Planning contact', order: 8 },
          { phrase: 'Bottom line', meaning: 'Kết quả cuối cùng', example: 'The bottom line is we need to cut costs.', context: 'Main point', order: 9 },
          { phrase: 'Think outside the box', meaning: 'Suy nghĩ sáng tạo', example: 'We need to think outside the box on this.', context: 'Encouraging creativity', order: 10 },
          { phrase: 'Win-win situation', meaning: 'Có lợi cho cả hai bên', example: 'This is a win-win situation for everyone.', context: 'Mutual benefit', order: 11 },
          { phrase: 'Keep you posted', meaning: 'Sẽ báo cho bạn biết', example: 'I\'ll keep you posted on the progress.', context: 'Promising updates', order: 12 },
        ]
      },
      dialogues: {
        create: [
          { speaker: 'Manager', text: 'Good morning, everyone. Thank you for joining today\'s meeting.', translation: 'Chào buổi sáng mọi người. Cảm ơn đã tham gia cuộc họp hôm nay.', gender: 'male', order: 1 },
          { speaker: 'Team', text: 'Good morning!', translation: 'Chào buổi sáng!', gender: 'female', order: 2 },
          { speaker: 'Manager', text: 'Let\'s review the agenda. First, we\'ll discuss Q3 results, then move to the new product launch.', translation: 'Hãy xem chương trình họp. Đầu tiên, chúng ta sẽ thảo luận kết quả quý 3, sau đó chuyển sang ra mắt sản phẩm mới.', gender: 'male', order: 3 },
          { speaker: 'Sarah', text: 'Before we start, I have some updated figures from the sales team.', translation: 'Trước khi bắt đầu, tôi có một số con số cập nhật từ đội bán hàng.', gender: 'female', order: 4 },
          { speaker: 'Manager', text: 'Great! Please go ahead and share those with us.', translation: 'Tuyệt! Hãy chia sẻ với chúng tôi.', gender: 'male', order: 5 },
          { speaker: 'Sarah', text: 'Our revenue increased by 15% compared to last quarter, exceeding our forecast.', translation: 'Doanh thu của chúng ta tăng 15% so với quý trước, vượt dự báo.', gender: 'female', order: 6 },
          { speaker: 'John', text: 'That\'s excellent news! What drove this growth?', translation: 'Đó là tin tuyệt vời! Điều gì thúc đẩy sự tăng trưởng này?', gender: 'male', order: 7 },
          { speaker: 'Sarah', text: 'Mainly our digital marketing campaign and improved customer retention.', translation: 'Chủ yếu là chiến dịch marketing kỹ thuật số và cải thiện giữ chân khách hàng.', gender: 'female', order: 8 },
          { speaker: 'Manager', text: 'Speaking of marketing, I\'d like to propose increasing the budget for Q4.', translation: 'Nói về marketing, tôi muốn đề xuất tăng ngân sách cho quý 4.', gender: 'male', order: 9 },
          { speaker: 'John', text: 'By how much are we talking?', translation: 'Chúng ta đang nói về mức tăng bao nhiêu?', gender: 'male', order: 10 },
          { speaker: 'Manager', text: 'I\'m thinking 20%. This would allow us to expand into new markets.', translation: 'Tôi đang nghĩ 20%. Điều này sẽ cho phép chúng ta mở rộng sang thị trường mới.', gender: 'male', order: 11 },
          { speaker: 'Sarah', text: 'I think that\'s a smart move. The ROI from our current campaigns has been strong.', translation: 'Tôi nghĩ đó là một động thái thông minh. ROI từ các chiến dịch hiện tại đã rất tốt.', gender: 'female', order: 12 },
        ]
      }
    }
  })

  console.log('\n✅ Hoàn thành! Đã thêm 3 bài học phong phú:')
  console.log('   - 58 từ vựng chi tiết')
  console.log('   - 32 cụm từ thực tế')
  console.log('   - 47 đoạn hội thoại dài\n')
  console.log('🎉 Tổng thời gian học: 2 giờ!\n')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
