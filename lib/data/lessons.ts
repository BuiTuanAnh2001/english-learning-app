import { Category, Lesson } from '../types';

// Categories for the English learning app
export const categories: Category[] = [
  {
    id: 'daily',
    name: 'Giao tiếp hàng ngày',
    description: 'Học các cụm từ và hội thoại thường ngày',
    icon: '💬',
    lessonCount: 7,
  },
  {
    id: 'business',
    name: 'Tiếng Anh thương mại',
    description: 'Tiếng Anh cho công việc và kinh doanh',
    icon: '💼',
    lessonCount: 3,
  },
  {
    id: 'travel',
    name: 'Tiếng Anh du lịch',
    description: 'Giao tiếp khi đi du lịch nước ngoài',
    icon: '✈️',
    lessonCount: 3,
  },
  {
    id: 'beginner',
    name: 'Dành cho người mới',
    description: 'Các bài học cơ bản cho người mới bắt đầu',
    icon: '🎯',
    lessonCount: 0,
  },
];

// Sample lessons with full content
export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Chào hỏi và giới thiệu',
    category: 'daily',
    level: 'beginner',
    description: 'Học cách chào hỏi và giới thiệu bản thân trong các tình huống hàng ngày',
    duration: '15 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Hello',
        pronunciation: '/həˈloʊ/',
        meaning: 'Xin chào',
        example: 'Hello! How are you today?',
      },
      {
        word: 'Nice to meet you',
        pronunciation: '/naɪs tuː miːt juː/',
        meaning: 'Rất vui được gặp bạn',
        example: 'Hi, I\'m John. Nice to meet you!',
      },
      {
        word: 'My name is',
        pronunciation: '/maɪ neɪm ɪz/',
        meaning: 'Tên tôi là',
        example: 'My name is Sarah. What\'s your name?',
      },
      {
        word: 'Where are you from?',
        pronunciation: '/weər ɑːr juː frʌm/',
        meaning: 'Bạn đến từ đâu?',
        example: 'Where are you from? I\'m from Vietnam.',
      },
      {
        word: 'Goodbye',
        pronunciation: '/ɡʊdˈbaɪ/',
        meaning: 'Tạm biệt',
        example: 'It was nice talking to you. Goodbye!',
      },
    ],
    phrases: [
      {
        phrase: 'How are you doing?',
        meaning: 'Bạn thế nào rồi?',
        example: 'Hey Mike! How are you doing? - I\'m doing great, thanks!',
      },
      {
        phrase: 'Pleased to meet you',
        meaning: 'Hân hạnh được gặp bạn',
        example: 'This is my colleague, Anna. - Pleased to meet you, Anna!',
      },
      {
        phrase: 'What do you do?',
        meaning: 'Bạn làm nghề gì?',
        example: 'What do you do? - I\'m a software engineer.',
      },
      {
        phrase: 'See you later',
        meaning: 'Hẹn gặp lại',
        example: 'I have to go now. See you later! - Bye, see you!',
      },
    ],
    dialogues: [
      {
        speaker: 'A',
        text: 'Hello! My name is David. What\'s your name?',
        translation: 'Xin chào! Tên tôi là David. Bạn tên gì?',
      },
      {
        speaker: 'B',
        text: 'Hi David! I\'m Lisa. Nice to meet you.',
        translation: 'Chào David! Tôi là Lisa. Rất vui được gặp bạn.',
      },
      {
        speaker: 'A',
        text: 'Nice to meet you too, Lisa. Where are you from?',
        translation: 'Tôi cũng rất vui được gặp bạn, Lisa. Bạn đến từ đâu?',
      },
      {
        speaker: 'B',
        text: 'I\'m from Canada. How about you?',
        translation: 'Tôi đến từ Canada. Còn bạn thì sao?',
      },
      {
        speaker: 'A',
        text: 'I\'m from Australia. What do you do, Lisa?',
        translation: 'Tôi đến từ Úc. Bạn làm nghề gì, Lisa?',
      },
      {
        speaker: 'B',
        text: 'I\'m a teacher. And you?',
        translation: 'Tôi là giáo viên. Còn bạn?',
      },
      {
        speaker: 'A',
        text: 'I\'m a doctor. Well, it was nice talking to you!',
        translation: 'Tôi là bác sĩ. Được nói chuyện với bạn thật vui!',
      },
      {
        speaker: 'B',
        text: 'Same here! See you later, David!',
        translation: 'Tôi cũng vậy! Hẹn gặp lại, David!',
      },
    ],
  },
  {
    id: '2',
    title: 'Đặt hàng tại nhà hàng',
    category: 'daily',
    level: 'intermediate',
    description: 'Học cách đặt món và giao tiếp với nhân viên phục vụ tại nhà hàng',
    duration: '20 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Menu',
        pronunciation: '/ˈmenjuː/',
        meaning: 'Thực đơn',
        example: 'Can I see the menu, please?',
      },
      {
        word: 'Order',
        pronunciation: '/ˈɔːrdər/',
        meaning: 'Đặt món',
        example: 'Are you ready to order?',
      },
      {
        word: 'Reservation',
        pronunciation: '/ˌrezərˈveɪʃn/',
        meaning: 'Đặt chỗ trước',
        example: 'I\'d like to make a reservation for two people.',
      },
      {
        word: 'Bill',
        pronunciation: '/bɪl/',
        meaning: 'Hóa đơn',
        example: 'Can I have the bill, please?',
      },
      {
        word: 'Appetizer',
        pronunciation: '/ˈæpɪtaɪzər/',
        meaning: 'Món khai vị',
        example: 'I\'ll start with the soup as an appetizer.',
      },
    ],
    phrases: [
      {
        phrase: 'I\'d like to order...',
        meaning: 'Tôi muốn gọi...',
        example: 'I\'d like to order the grilled salmon, please.',
      },
      {
        phrase: 'Could you recommend something?',
        meaning: 'Bạn có thể giới thiệu món gì không?',
        example: 'This is my first time here. Could you recommend something?',
      },
      {
        phrase: 'Is this dish spicy?',
        meaning: 'Món này có cay không?',
        example: 'Is this dish spicy? I don\'t eat spicy food.',
      },
      {
        phrase: 'Can I have the check?',
        meaning: 'Cho tôi xin hóa đơn?',
        example: 'Excuse me, can I have the check, please?',
      },
    ],
    dialogues: [
      {
        speaker: 'Waiter',
        text: 'Good evening! Do you have a reservation?',
        translation: 'Chào buổi tối! Quý khách có đặt bàn trước không?',
      },
      {
        speaker: 'Customer',
        text: 'Yes, a table for two under the name Johnson.',
        translation: 'Có, bàn cho hai người dưới tên Johnson.',
      },
      {
        speaker: 'Waiter',
        text: 'Perfect! Right this way, please. Here\'s your menu.',
        translation: 'Hoàn hảo! Mời quý khách đi theo. Đây là thực đơn.',
      },
      {
        speaker: 'Customer',
        text: 'Thank you. Could you recommend a good appetizer?',
        translation: 'Cảm ơn. Bạn có thể giới thiệu món khai vị ngon không?',
      },
      {
        speaker: 'Waiter',
        text: 'Our Caesar salad is very popular. Would you like to try it?',
        translation: 'Salad Caesar của chúng tôi rất được ưa chuộng. Quý khách có muốn thử không?',
      },
      {
        speaker: 'Customer',
        text: 'That sounds great! And for the main course, I\'ll have the steak.',
        translation: 'Nghe hay đấy! Và cho món chính, tôi sẽ gọi bít tết.',
      },
      {
        speaker: 'Waiter',
        text: 'How would you like your steak cooked?',
        translation: 'Quý khách muốn bít tết chín ở mức độ nào?',
      },
      {
        speaker: 'Customer',
        text: 'Medium rare, please.',
        translation: 'Tái vừa, làm ơn.',
      },
    ],
  },
  {
    id: '3',
    title: 'Họp và thuyết trình',
    category: 'business',
    level: 'advanced',
    description: 'Kỹ năng giao tiếp trong môi trường công việc chuyên nghiệp',
    duration: '25 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Agenda',
        pronunciation: '/əˈdʒendə/',
        meaning: 'Chương trình họp',
        example: 'Let\'s review the agenda for today\'s meeting.',
      },
      {
        word: 'Presentation',
        pronunciation: '/ˌprezənˈteɪʃn/',
        meaning: 'Bài thuyết trình',
        example: 'I\'ll give a presentation on our quarterly results.',
      },
      {
        word: 'Deadline',
        pronunciation: '/ˈdedlaɪn/',
        meaning: 'Thời hạn',
        example: 'The project deadline is next Friday.',
      },
      {
        word: 'Proposal',
        pronunciation: '/prəˈpoʊzl/',
        meaning: 'Đề xuất',
        example: 'We need to submit the proposal by end of month.',
      },
      {
        word: 'Stakeholder',
        pronunciation: '/ˈsteɪkhoʊldər/',
        meaning: 'Bên liên quan',
        example: 'We should consult with all stakeholders before making a decision.',
      },
    ],
    phrases: [
      {
        phrase: 'Let\'s move on to the next item',
        meaning: 'Chúng ta chuyển sang mục tiếp theo',
        example: 'That\'s settled then. Let\'s move on to the next item on the agenda.',
      },
      {
        phrase: 'I\'d like to bring up...',
        meaning: 'Tôi muốn đề cập đến...',
        example: 'I\'d like to bring up a concern about the timeline.',
      },
      {
        phrase: 'Could you elaborate on that?',
        meaning: 'Bạn có thể giải thích rõ hơn không?',
        example: 'That\'s an interesting point. Could you elaborate on that?',
      },
      {
        phrase: 'Let\'s table this discussion',
        meaning: 'Hãy tạm hoãn thảo luận này',
        example: 'We\'re running out of time. Let\'s table this discussion for now.',
      },
    ],
    dialogues: [
      {
        speaker: 'Manager',
        text: 'Good morning everyone. Let\'s get started with our weekly meeting.',
        translation: 'Chào buổi sáng mọi người. Chúng ta bắt đầu cuộc họp tuần nào.',
      },
      {
        speaker: 'Manager',
        text: 'First on the agenda is the project update. Sarah, would you like to present?',
        translation: 'Đầu tiên trong chương trình là cập nhật dự án. Sarah, bạn có muốn trình bày không?',
      },
      {
        speaker: 'Sarah',
        text: 'Yes, thank you. I\'m pleased to report that we\'re on track with the timeline.',
        translation: 'Vâng, cảm ơn. Tôi vui mừng báo cáo rằng chúng ta đang đúng tiến độ.',
      },
      {
        speaker: 'John',
        text: 'That\'s great news. Could you elaborate on the challenges we faced?',
        translation: 'Đó là tin tốt. Bạn có thể giải thích rõ hơn về những thách thức chúng ta đã gặp không?',
      },
      {
        speaker: 'Sarah',
        text: 'Of course. We had some initial delays with the vendor, but we\'ve resolved them.',
        translation: 'Tất nhiên. Chúng ta có một số chậm trễ ban đầu với nhà cung cấp, nhưng đã giải quyết được.',
      },
      {
        speaker: 'Manager',
        text: 'Excellent work. Now, let\'s move on to the budget discussion.',
        translation: 'Làm việc xuất sắc. Bây giờ, chúng ta chuyển sang thảo luận ngân sách.',
      },
    ],
  },
  {
    id: '4',
    title: 'Đặt phòng khách sạn',
    category: 'travel',
    level: 'intermediate',
    description: 'Học cách đặt phòng và giao tiếp tại khách sạn',
    duration: '18 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Check-in',
        pronunciation: '/ˈtʃek ɪn/',
        meaning: 'Làm thủ tục nhận phòng',
        example: 'What time is check-in?',
      },
      {
        word: 'Check-out',
        pronunciation: '/ˈtʃek aʊt/',
        meaning: 'Trả phòng',
        example: 'Check-out time is at 11 AM.',
      },
      {
        word: 'Reservation',
        pronunciation: '/ˌrezərˈveɪʃn/',
        meaning: 'Đặt phòng',
        example: 'I have a reservation under the name Smith.',
      },
      {
        word: 'Available',
        pronunciation: '/əˈveɪləbl/',
        meaning: 'Còn trống',
        example: 'Do you have any rooms available for tonight?',
      },
      {
        word: 'Amenities',
        pronunciation: '/əˈmenətiz/',
        meaning: 'Tiện nghi',
        example: 'What amenities are included in the room?',
      },
    ],
    phrases: [
      {
        phrase: 'I\'d like to book a room',
        meaning: 'Tôi muốn đặt phòng',
        example: 'Hello, I\'d like to book a room for two nights.',
      },
      {
        phrase: 'Do you have a room with a view?',
        meaning: 'Bạn có phòng có tầm nhìn không?',
        example: 'Do you have a room with a view of the ocean?',
      },
      {
        phrase: 'What\'s included in the price?',
        meaning: 'Giá này bao gồm những gì?',
        example: 'What\'s included in the price? Is breakfast included?',
      },
      {
        phrase: 'Could I have a wake-up call?',
        meaning: 'Tôi có thể nhờ gọi đánh thức không?',
        example: 'Could I have a wake-up call at 7 AM tomorrow?',
      },
    ],
    dialogues: [
      {
        speaker: 'Guest',
        text: 'Hello, I\'d like to check in. I have a reservation under Johnson.',
        translation: 'Xin chào, tôi muốn nhận phòng. Tôi có đặt phòng dưới tên Johnson.',
      },
      {
        speaker: 'Receptionist',
        text: 'Welcome! Let me look that up for you. Yes, I have your reservation here.',
        translation: 'Chào mừng! Để tôi tra cứu cho bạn. Vâng, tôi có đặt phòng của bạn ở đây.',
      },
      {
        speaker: 'Receptionist',
        text: 'You\'ve booked a deluxe room for three nights. Is that correct?',
        translation: 'Bạn đã đặt phòng deluxe cho ba đêm. Đúng không?',
      },
      {
        speaker: 'Guest',
        text: 'Yes, that\'s right. Does the room have a view?',
        translation: 'Vâng, đúng vậy. Phòng có tầm nhìn không?',
      },
      {
        speaker: 'Receptionist',
        text: 'Yes, you have a beautiful ocean view. Here\'s your room key card.',
        translation: 'Có, bạn có tầm nhìn đại dương tuyệt đẹp. Đây là thẻ chìa khóa phòng của bạn.',
      },
      {
        speaker: 'Guest',
        text: 'Perfect! What time is breakfast served?',
        translation: 'Hoàn hảo! Bữa sáng được phục vụ lúc mấy giờ?',
      },
      {
        speaker: 'Receptionist',
        text: 'Breakfast is served from 7 to 10 AM in the restaurant on the first floor.',
        translation: 'Bữa sáng được phục vụ từ 7 đến 10 giờ sáng tại nhà hàng ở tầng một.',
      },
      {
        speaker: 'Guest',
        text: 'Great! Thank you so much.',
        translation: 'Tuyệt vời! Cảm ơn bạn rất nhiều.',
      },
    ],
  },
  {
    id: '5',
    title: 'Mua sắm và thanh toán',
    category: 'daily',
    level: 'beginner',
    description: 'Học cách hỏi giá, mặc cả và thanh toán khi mua sắm',
    duration: '18 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Price',
        pronunciation: '/praɪs/',
        meaning: 'Giá',
        example: 'What\'s the price of this shirt?',
      },
      {
        word: 'Discount',
        pronunciation: '/ˈdɪskaʊnt/',
        meaning: 'Giảm giá',
        example: 'Is there any discount on this item?',
      },
      {
        word: 'Receipt',
        pronunciation: '/rɪˈsiːt/',
        meaning: 'Hóa đơn',
        example: 'Can I have a receipt, please?',
      },
      {
        word: 'Size',
        pronunciation: '/saɪz/',
        meaning: 'Kích cỡ',
        example: 'Do you have this in a larger size?',
      },
      {
        word: 'Try on',
        pronunciation: '/traɪ ɒn/',
        meaning: 'Thử (quần áo)',
        example: 'Can I try this on?',
      },
    ],
    phrases: [
      {
        phrase: 'How much is this?',
        meaning: 'Cái này giá bao nhiêu?',
        example: 'Excuse me, how much is this jacket?',
      },
      {
        phrase: 'Do you accept credit cards?',
        meaning: 'Bạn nhận thẻ tín dụng không?',
        example: 'Do you accept credit cards or only cash?',
      },
      {
        phrase: 'Can I get a refund?',
        meaning: 'Tôi có thể được hoàn tiền không?',
        example: 'If it doesn\'t fit, can I get a refund?',
      },
      {
        phrase: 'I\'ll take it',
        meaning: 'Tôi sẽ lấy nó',
        example: 'This looks perfect. I\'ll take it!',
      },
    ],
    dialogues: [
      {
        speaker: 'Customer',
        text: 'Excuse me, how much is this dress?',
        translation: 'Xin lỗi, chiếc váy này giá bao nhiêu?',
      },
      {
        speaker: 'Salesperson',
        text: 'That one is $45. It\'s on sale today, actually.',
        translation: 'Chiếc đó là 45 đô la. Hôm nay nó đang giảm giá.',
      },
      {
        speaker: 'Customer',
        text: 'Great! Do you have it in a medium size?',
        translation: 'Tuyệt! Bạn có size M không?',
      },
      {
        speaker: 'Salesperson',
        text: 'Let me check... Yes, here you go. Would you like to try it on?',
        translation: 'Để tôi kiểm tra... Có, của bạn đây. Bạn có muốn thử không?',
      },
      {
        speaker: 'Customer',
        text: 'Yes, please. Where\'s the fitting room?',
        translation: 'Vâng. Phòng thử đồ ở đâu?',
      },
      {
        speaker: 'Salesperson',
        text: 'It\'s right over there, on your left.',
        translation: 'Nó ở ngay đằng kia, bên trái bạn.',
      },
    ],
  },
  {
    id: '6',
    title: 'Hỏi đường và chỉ đường',
    category: 'travel',
    level: 'beginner',
    description: 'Học cách hỏi và chỉ đường trong thành phố',
    duration: '16 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Direction',
        pronunciation: '/dəˈrekʃn/',
        meaning: 'Hướng',
        example: 'Can you give me directions to the museum?',
      },
      {
        word: 'Turn',
        pronunciation: '/tɜːrn/',
        meaning: 'Rẽ',
        example: 'Turn left at the traffic light.',
      },
      {
        word: 'Straight',
        pronunciation: '/streɪt/',
        meaning: 'Thẳng',
        example: 'Go straight for two blocks.',
      },
      {
        word: 'Corner',
        pronunciation: '/ˈkɔːrnər/',
        meaning: 'Góc',
        example: 'The bank is on the corner.',
      },
      {
        word: 'Block',
        pronunciation: '/blɑːk/',
        meaning: 'Dãy nhà',
        example: 'It\'s three blocks from here.',
      },
    ],
    phrases: [
      {
        phrase: 'How do I get to...?',
        meaning: 'Làm sao để đến...?',
        example: 'Excuse me, how do I get to the train station?',
      },
      {
        phrase: 'Is it far from here?',
        meaning: 'Nó có xa từ đây không?',
        example: 'Is the museum far from here?',
      },
      {
        phrase: 'You can\'t miss it',
        meaning: 'Bạn không thể bỏ lỡ nó (dễ tìm)',
        example: 'It\'s a big building. You can\'t miss it.',
      },
      {
        phrase: 'On your right/left',
        meaning: 'Ở bên phải/trái của bạn',
        example: 'The post office is on your right.',
      },
    ],
    dialogues: [
      {
        speaker: 'Tourist',
        text: 'Excuse me, how do I get to the central station?',
        translation: 'Xin lỗi, làm sao để đến ga trung tâm?',
      },
      {
        speaker: 'Local',
        text: 'Sure! Go straight down this street for about 5 minutes.',
        translation: 'Chắc chắn rồi! Đi thẳng xuống con đường này khoảng 5 phút.',
      },
      {
        speaker: 'Local',
        text: 'Then turn right at the traffic light. You\'ll see a big park.',
        translation: 'Sau đó rẽ phải ở đèn giao thông. Bạn sẽ thấy một công viên lớn.',
      },
      {
        speaker: 'Tourist',
        text: 'Okay. And then?',
        translation: 'Được. Và sau đó?',
      },
      {
        speaker: 'Local',
        text: 'Keep walking past the park, and the station is on your left.',
        translation: 'Tiếp tục đi qua công viên, và ga ở bên trái bạn.',
      },
      {
        speaker: 'Tourist',
        text: 'Is it far from here?',
        translation: 'Nó có xa từ đây không?',
      },
      {
        speaker: 'Local',
        text: 'Not really. About a 10-minute walk.',
        translation: 'Không hẳn. Khoảng 10 phút đi bộ.',
      },
      {
        speaker: 'Tourist',
        text: 'Perfect! Thank you so much!',
        translation: 'Hoàn hảo! Cảm ơn bạn rất nhiều!',
      },
    ],
  },
  {
    id: '7',
    title: 'Gọi điện thoại',
    category: 'daily',
    level: 'intermediate',
    description: 'Học cách gọi điện thoại và để lại lời nhắn',
    duration: '17 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Call',
        pronunciation: '/kɔːl/',
        meaning: 'Gọi điện',
        example: 'I need to make a phone call.',
      },
      {
        word: 'Message',
        pronunciation: '/ˈmesɪdʒ/',
        meaning: 'Tin nhắn',
        example: 'Can I leave a message?',
      },
      {
        word: 'Hold on',
        pronunciation: '/hoʊld ɒn/',
        meaning: 'Giữ máy',
        example: 'Hold on, please. I\'ll transfer you.',
      },
      {
        word: 'Voicemail',
        pronunciation: '/ˈvɔɪsmeɪl/',
        meaning: 'Hộp thư thoại',
        example: 'Please leave a message after the beep.',
      },
      {
        word: 'Extension',
        pronunciation: '/ɪkˈstenʃn/',
        meaning: 'Số máy lẻ',
        example: 'What\'s your extension number?',
      },
    ],
    phrases: [
      {
        phrase: 'May I speak to...?',
        meaning: 'Tôi có thể nói chuyện với...?',
        example: 'Hello, may I speak to Mr. Johnson?',
      },
      {
        phrase: 'Speaking',
        meaning: 'Đang nghe (tôi đây)',
        example: 'This is John speaking. How can I help you?',
      },
      {
        phrase: 'I\'ll call back later',
        meaning: 'Tôi sẽ gọi lại sau',
        example: 'He\'s not available right now. I\'ll call back later.',
      },
      {
        phrase: 'Could you speak up?',
        meaning: 'Bạn có thể nói to hơn không?',
        example: 'Sorry, could you speak up? I can\'t hear you well.',
      },
    ],
    dialogues: [
      {
        speaker: 'Caller',
        text: 'Hello, may I speak to Sarah Thompson?',
        translation: 'Xin chào, tôi có thể nói chuyện với Sarah Thompson không?',
      },
      {
        speaker: 'Receptionist',
        text: 'One moment, please. Let me transfer you.',
        translation: 'Một chút, làm ơn. Để tôi chuyển máy cho bạn.',
      },
      {
        speaker: 'Receptionist',
        text: 'I\'m sorry, but she\'s in a meeting right now. Would you like to leave a message?',
        translation: 'Tôi xin lỗi, nhưng cô ấy đang họp. Bạn có muốn để lại lời nhắn không?',
      },
      {
        speaker: 'Caller',
        text: 'Yes, please. Could you tell her that David called about the project?',
        translation: 'Vâng, làm ơn. Bạn có thể nói với cô ấy rằng David đã gọi về dự án không?',
      },
      {
        speaker: 'Receptionist',
        text: 'Certainly. May I have your phone number?',
        translation: 'Chắc chắn rồi. Tôi có thể có số điện thoại của bạn không?',
      },
      {
        speaker: 'Caller',
        text: 'It\'s 555-0123. She can call me back anytime today.',
        translation: 'Là 555-0123. Cô ấy có thể gọi lại cho tôi bất cứ lúc nào hôm nay.',
      },
    ],
  },
  {
    id: '8',
    title: 'Đặt vé máy bay',
    category: 'travel',
    level: 'intermediate',
    description: 'Học cách đặt vé máy bay và làm thủ tục tại sân bay',
    duration: '20 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Flight',
        pronunciation: '/flaɪt/',
        meaning: 'Chuyến bay',
        example: 'What time is your flight?',
      },
      {
        word: 'Boarding pass',
        pronunciation: '/ˈbɔːrdɪŋ pæs/',
        meaning: 'Thẻ lên máy bay',
        example: 'Please show your boarding pass at the gate.',
      },
      {
        word: 'Luggage',
        pronunciation: '/ˈlʌɡɪdʒ/',
        meaning: 'Hành lý',
        example: 'How many pieces of luggage are you checking in?',
      },
      {
        word: 'Gate',
        pronunciation: '/ɡeɪt/',
        meaning: 'Cổng lên máy bay',
        example: 'Your flight departs from gate 15.',
      },
      {
        word: 'Seat',
        pronunciation: '/siːt/',
        meaning: 'Chỗ ngồi',
        example: 'Would you prefer a window or aisle seat?',
      },
    ],
    phrases: [
      {
        phrase: 'I\'d like to book a flight',
        meaning: 'Tôi muốn đặt một chuyến bay',
        example: 'I\'d like to book a flight to New York for next week.',
      },
      {
        phrase: 'One-way or round-trip?',
        meaning: 'Một chiều hay khứ hồi?',
        example: 'Are you looking for a one-way or round-trip ticket?',
      },
      {
        phrase: 'Window or aisle seat?',
        meaning: 'Chỗ ngồi cạnh cửa sổ hay lối đi?',
        example: 'Would you prefer a window or aisle seat?',
      },
      {
        phrase: 'Check-in counter',
        meaning: 'Quầy làm thủ tục',
        example: 'Where is the check-in counter for international flights?',
      },
    ],
    dialogues: [
      {
        speaker: 'Passenger',
        text: 'Hello, I\'d like to check in for the 10 AM flight to London.',
        translation: 'Xin chào, tôi muốn làm thủ tục cho chuyến bay 10 giờ sáng đến London.',
      },
      {
        speaker: 'Agent',
        text: 'Certainly. May I see your passport and ticket, please?',
        translation: 'Chắc chắn rồi. Tôi có thể xem hộ chiếu và vé của bạn không?',
      },
      {
        speaker: 'Passenger',
        text: 'Here you are.',
        translation: 'Của bạn đây.',
      },
      {
        speaker: 'Agent',
        text: 'Thank you. How many bags are you checking in today?',
        translation: 'Cảm ơn. Hôm nay bạn ký gửi bao nhiêu túi?',
      },
      {
        speaker: 'Passenger',
        text: 'Just one suitcase. And I have a carry-on as well.',
        translation: 'Chỉ một va li. Và tôi cũng có một túi xách tay.',
      },
      {
        speaker: 'Agent',
        text: 'Perfect. Would you like a window or aisle seat?',
        translation: 'Hoàn hảo. Bạn muốn chỗ ngồi cạnh cửa sổ hay lối đi?',
      },
      {
        speaker: 'Passenger',
        text: 'Window seat, please.',
        translation: 'Chỗ ngồi cạnh cửa sổ, làm ơn.',
      },
      {
        speaker: 'Agent',
        text: 'Here\'s your boarding pass. Boarding starts at 9:30 at gate 12.',
        translation: 'Đây là thẻ lên máy bay của bạn. Lên máy bay bắt đầu lúc 9:30 ở cổng 12.',
      },
    ],
  },
  {
    id: '9',
    title: 'Đi khám bác sĩ',
    category: 'daily',
    level: 'intermediate',
    description: 'Học cách mô tả triệu chứng bệnh và giao tiếp với bác sĩ',
    duration: '19 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Symptom',
        pronunciation: '/ˈsɪmptəm/',
        meaning: 'Triệu chứng',
        example: 'What are your symptoms?',
      },
      {
        word: 'Pain',
        pronunciation: '/peɪn/',
        meaning: 'Đau',
        example: 'I have a sharp pain in my chest.',
      },
      {
        word: 'Prescription',
        pronunciation: '/prɪˈskrɪpʃn/',
        meaning: 'Đơn thuốc',
        example: 'Here\'s your prescription for antibiotics.',
      },
      {
        word: 'Fever',
        pronunciation: '/ˈfiːvər/',
        meaning: 'Sốt',
        example: 'I\'ve had a fever for two days.',
      },
      {
        word: 'Appointment',
        pronunciation: '/əˈpɔɪntmənt/',
        meaning: 'Cuộc hẹn',
        example: 'I\'d like to make an appointment with Dr. Smith.',
      },
    ],
    phrases: [
      {
        phrase: 'I don\'t feel well',
        meaning: 'Tôi cảm thấy không khỏe',
        example: 'I don\'t feel well. I think I need to see a doctor.',
      },
      {
        phrase: 'I have a headache',
        meaning: 'Tôi bị đau đầu',
        example: 'I have a terrible headache and feel dizzy.',
      },
      {
        phrase: 'How long have you had this?',
        meaning: 'Bạn bị như vậy bao lâu rồi?',
        example: 'How long have you had this pain?',
      },
      {
        phrase: 'Take this medicine',
        meaning: 'Uống thuốc này',
        example: 'Take this medicine three times a day after meals.',
      },
    ],
    dialogues: [
      {
        speaker: 'Doctor',
        text: 'Good morning. What brings you in today?',
        translation: 'Chào buổi sáng. Điều gì đưa bạn đến hôm nay?',
      },
      {
        speaker: 'Patient',
        text: 'I\'ve been feeling really tired and I have a sore throat.',
        translation: 'Tôi cảm thấy rất mệt và bị đau họng.',
      },
      {
        speaker: 'Doctor',
        text: 'I see. How long have you had these symptoms?',
        translation: 'Tôi hiểu rồi. Bạn có những triệu chứng này bao lâu rồi?',
      },
      {
        speaker: 'Patient',
        text: 'About three days now. I also have a slight fever.',
        translation: 'Khoảng ba ngày rồi. Tôi cũng bị sốt nhẹ.',
      },
      {
        speaker: 'Doctor',
        text: 'Let me check your temperature and throat. Say "ah" please.',
        translation: 'Để tôi kiểm tra nhiệt độ và họng của bạn. Nói "à" làm ơn.',
      },
      {
        speaker: 'Patient',
        text: 'Ahhh...',
        translation: 'Àààà...',
      },
      {
        speaker: 'Doctor',
        text: 'You have a throat infection. I\'ll prescribe some antibiotics.',
        translation: 'Bạn bị nhiễm trùng họng. Tôi sẽ kê đơn một số thuốc kháng sinh.',
      },
      {
        speaker: 'Patient',
        text: 'Thank you, doctor. When should I start feeling better?',
        translation: 'Cảm ơn bác sĩ. Khi nào tôi sẽ bắt đầu cảm thấy tốt hơn?',
      },
    ],
  },
  {
    id: '10',
    title: 'Phỏng vấn xin việc',
    category: 'business',
    level: 'advanced',
    description: 'Chuẩn bị cho buổi phỏng vấn xin việc bằng tiếng Anh',
    duration: '25 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Resume',
        pronunciation: '/ˈrezəmeɪ/',
        meaning: 'Sơ yếu lý lịch',
        example: 'Please bring your resume to the interview.',
      },
      {
        word: 'Experience',
        pronunciation: '/ɪkˈspɪriəns/',
        meaning: 'Kinh nghiệm',
        example: 'Tell me about your work experience.',
      },
      {
        word: 'Qualification',
        pronunciation: '/ˌkwɑːlɪfɪˈkeɪʃn/',
        meaning: 'Bằng cấp, trình độ',
        example: 'What are your qualifications for this position?',
      },
      {
        word: 'Strength',
        pronunciation: '/streŋθ/',
        meaning: 'Điểm mạnh',
        example: 'What are your greatest strengths?',
      },
      {
        word: 'Weakness',
        pronunciation: '/ˈwiːknəs/',
        meaning: 'Điểm yếu',
        example: 'Tell me about a weakness you\'re working on.',
      },
    ],
    phrases: [
      {
        phrase: 'Tell me about yourself',
        meaning: 'Hãy kể về bản thân bạn',
        example: 'Let\'s start with: Tell me about yourself.',
      },
      {
        phrase: 'Why do you want this job?',
        meaning: 'Tại sao bạn muốn công việc này?',
        example: 'Why do you want to work for our company?',
      },
      {
        phrase: 'What are your career goals?',
        meaning: 'Mục tiêu nghề nghiệp của bạn là gì?',
        example: 'What are your long-term career goals?',
      },
      {
        phrase: 'Do you have any questions?',
        meaning: 'Bạn có câu hỏi nào không?',
        example: 'Before we finish, do you have any questions for me?',
      },
    ],
    dialogues: [
      {
        speaker: 'Interviewer',
        text: 'Good morning. Please have a seat. Tell me about yourself.',
        translation: 'Chào buổi sáng. Mời bạn ngồi. Hãy kể về bản thân bạn.',
      },
      {
        speaker: 'Candidate',
        text: 'Thank you. I\'m a software engineer with 5 years of experience in web development.',
        translation: 'Cảm ơn. Tôi là kỹ sư phần mềm với 5 năm kinh nghiệm phát triển web.',
      },
      {
        speaker: 'Interviewer',
        text: 'Interesting. Why are you interested in this position?',
        translation: 'Thú vị. Tại sao bạn quan tâm đến vị trí này?',
      },
      {
        speaker: 'Candidate',
        text: 'I\'m excited about the innovative projects your company is working on. I believe my skills in React and Node.js would be a great fit.',
        translation: 'Tôi hào hứng với các dự án sáng tạo mà công ty bạn đang làm. Tôi tin kỹ năng React và Node.js của tôi sẽ rất phù hợp.',
      },
      {
        speaker: 'Interviewer',
        text: 'Can you tell me about a challenging project you worked on?',
        translation: 'Bạn có thể kể về một dự án thách thức mà bạn đã làm không?',
      },
      {
        speaker: 'Candidate',
        text: 'Certainly. At my current company, I led the development of a real-time chat application that now serves over 10,000 users.',
        translation: 'Chắc chắn rồi. Ở công ty hiện tại, tôi đã dẫn dắt phát triển ứng dụng chat thời gian thực hiện phục vụ hơn 10,000 người dùng.',
      },
      {
        speaker: 'Interviewer',
        text: 'Impressive! What are your salary expectations?',
        translation: 'Ấn tượng! Kỳ vọng lương của bạn là gì?',
      },
      {
        speaker: 'Candidate',
        text: 'Based on my experience and research, I\'m looking for something in the range of $80,000 to $90,000.',
        translation: 'Dựa trên kinh nghiệm và nghiên cứu của tôi, tôi đang tìm kiếm khoảng từ 80,000 đến 90,000 đô la.',
      },
    ],
  },
  {
    id: '11',
    title: 'Thời tiết và khí hậu',
    category: 'daily',
    level: 'beginner',
    description: 'Học cách nói về thời tiết và dự báo',
    duration: '14 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Weather',
        pronunciation: '/ˈweðər/',
        meaning: 'Thời tiết',
        example: 'What\'s the weather like today?',
      },
      {
        word: 'Sunny',
        pronunciation: '/ˈsʌni/',
        meaning: 'Nắng',
        example: 'It\'s a beautiful sunny day.',
      },
      {
        word: 'Rainy',
        pronunciation: '/ˈreɪni/',
        meaning: 'Mưa',
        example: 'Don\'t forget your umbrella. It\'s rainy outside.',
      },
      {
        word: 'Temperature',
        pronunciation: '/ˈtemprətʃər/',
        meaning: 'Nhiệt độ',
        example: 'The temperature is 25 degrees Celsius.',
      },
      {
        word: 'Forecast',
        pronunciation: '/ˈfɔːrkæst/',
        meaning: 'Dự báo',
        example: 'What does the forecast say for tomorrow?',
      },
    ],
    phrases: [
      {
        phrase: 'It\'s hot/cold',
        meaning: 'Trời nóng/lạnh',
        example: 'It\'s really hot today! Let\'s go to the beach.',
      },
      {
        phrase: 'What\'s the weather like?',
        meaning: 'Thời tiết thế nào?',
        example: 'What\'s the weather like in your city?',
      },
      {
        phrase: 'It looks like rain',
        meaning: 'Có vẻ sắp mưa',
        example: 'Take an umbrella. It looks like rain.',
      },
      {
        phrase: 'Nice day, isn\'t it?',
        meaning: 'Ngày đẹp trời phải không?',
        example: 'Nice day, isn\'t it? Perfect for a walk.',
      },
    ],
    dialogues: [
      {
        speaker: 'A',
        text: 'What\'s the weather like today?',
        translation: 'Thời tiết hôm nay thế nào?',
      },
      {
        speaker: 'B',
        text: 'It\'s partly cloudy with a chance of rain this afternoon.',
        translation: 'Trời có mây một phần với khả năng mưa chiều nay.',
      },
      {
        speaker: 'A',
        text: 'Should I bring an umbrella?',
        translation: 'Tôi có nên mang ô không?',
      },
      {
        speaker: 'B',
        text: 'Yes, that would be a good idea. The forecast says 70% chance of rain.',
        translation: 'Vâng, đó sẽ là ý kiến hay. Dự báo nói 70% khả năng mưa.',
      },
      {
        speaker: 'A',
        text: 'What about the temperature?',
        translation: 'Còn nhiệt độ thì sao?',
      },
      {
        speaker: 'B',
        text: 'It\'s about 22 degrees now, but it might get cooler later.',
        translation: 'Bây giờ khoảng 22 độ, nhưng có thể mát hơn sau.',
      },
    ],
  },
  {
    id: '12',
    title: 'Sở thích và giải trí',
    category: 'daily',
    level: 'beginner',
    description: 'Nói về sở thích, thể thao và hoạt động giải trí',
    duration: '16 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Hobby',
        pronunciation: '/ˈhɑːbi/',
        meaning: 'Sở thích',
        example: 'What are your hobbies?',
      },
      {
        word: 'Enjoy',
        pronunciation: '/ɪnˈdʒɔɪ/',
        meaning: 'Thích, tận hưởng',
        example: 'I enjoy reading in my free time.',
      },
      {
        word: 'Sport',
        pronunciation: '/spɔːrt/',
        meaning: 'Thể thao',
        example: 'Do you play any sports?',
      },
      {
        word: 'Music',
        pronunciation: '/ˈmjuːzɪk/',
        meaning: 'Âm nhạc',
        example: 'What kind of music do you like?',
      },
      {
        word: 'Movie',
        pronunciation: '/ˈmuːvi/',
        meaning: 'Phim',
        example: 'Would you like to watch a movie tonight?',
      },
    ],
    phrases: [
      {
        phrase: 'In my free time',
        meaning: 'Trong thời gian rảnh',
        example: 'In my free time, I like to play guitar.',
      },
      {
        phrase: 'I\'m into...',
        meaning: 'Tôi thích...',
        example: 'I\'m really into photography these days.',
      },
      {
        phrase: 'What do you do for fun?',
        meaning: 'Bạn làm gì cho vui?',
        example: 'What do you do for fun on weekends?',
      },
      {
        phrase: 'That sounds interesting',
        meaning: 'Nghe có vẻ thú vị',
        example: 'You play the piano? That sounds interesting!',
      },
    ],
    dialogues: [
      {
        speaker: 'A',
        text: 'So, what do you like to do in your free time?',
        translation: 'Vậy, bạn thích làm gì trong thời gian rảnh?',
      },
      {
        speaker: 'B',
        text: 'I love playing basketball. I play every weekend with friends.',
        translation: 'Tôi thích chơi bóng rổ. Tôi chơi mỗi cuối tuần với bạn bè.',
      },
      {
        speaker: 'A',
        text: 'That sounds fun! I\'m more into reading and watching movies.',
        translation: 'Nghe vui đấy! Tôi thích đọc sách và xem phim hơn.',
      },
      {
        speaker: 'B',
        text: 'What kind of movies do you like?',
        translation: 'Bạn thích loại phim gì?',
      },
      {
        speaker: 'A',
        text: 'I\'m really into sci-fi and action movies. How about you?',
        translation: 'Tôi rất thích phim khoa học viễn tưởng và hành động. Còn bạn?',
      },
      {
        speaker: 'B',
        text: 'I prefer comedies. They always make me laugh!',
        translation: 'Tôi thích phim hài hơn. Chúng luôn làm tôi cười!',
      },
    ],
  },
  {
    id: '13',
    title: 'Email công việc',
    category: 'business',
    level: 'intermediate',
    description: 'Học cách viết và trả lời email công việc chuyên nghiệp',
    duration: '22 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Subject',
        pronunciation: '/ˈsʌbdʒɪkt/',
        meaning: 'Chủ đề (email)',
        example: 'What should I put in the subject line?',
      },
      {
        word: 'Attachment',
        pronunciation: '/əˈtætʃmənt/',
        meaning: 'File đính kèm',
        example: 'Please see the attachment for more details.',
      },
      {
        word: 'Reply',
        pronunciation: '/rɪˈplaɪ/',
        meaning: 'Trả lời',
        example: 'I\'ll reply to your email by end of day.',
      },
      {
        word: 'Regards',
        pronunciation: '/rɪˈɡɑːrdz/',
        meaning: 'Trân trọng',
        example: 'Best regards, John Smith.',
      },
      {
        word: 'Follow up',
        pronunciation: '/ˈfɑːloʊ ʌp/',
        meaning: 'Theo dõi, liên hệ lại',
        example: 'I\'m following up on my previous email.',
      },
    ],
    phrases: [
      {
        phrase: 'I hope this email finds you well',
        meaning: 'Tôi hy vọng email này đến khi bạn đang khỏe',
        example: 'Dear Sarah, I hope this email finds you well.',
      },
      {
        phrase: 'Thank you for your prompt response',
        meaning: 'Cảm ơn bạn đã phản hồi nhanh chóng',
        example: 'Thank you for your prompt response to my inquiry.',
      },
      {
        phrase: 'Please let me know',
        meaning: 'Vui lòng cho tôi biết',
        example: 'Please let me know if you have any questions.',
      },
      {
        phrase: 'Looking forward to hearing from you',
        meaning: 'Mong được nghe tin từ bạn',
        example: 'Looking forward to hearing from you soon.',
      },
    ],
    dialogues: [
      {
        speaker: 'Email 1',
        text: 'Subject: Meeting Request - Project Update',
        translation: 'Chủ đề: Yêu cầu họp - Cập nhật dự án',
      },
      {
        speaker: 'Email 1',
        text: 'Dear Mr. Johnson, I hope this email finds you well. I would like to schedule a meeting to discuss the progress of our current project.',
        translation: 'Kính gửi Ông Johnson, Tôi hy vọng email này đến khi ông đang khỏe. Tôi muốn sắp xếp một cuộc họp để thảo luận về tiến độ dự án hiện tại của chúng ta.',
      },
      {
        speaker: 'Email 1',
        text: 'Would next Tuesday at 2 PM work for you? Please let me know your availability.',
        translation: 'Thứ Ba tới lúc 2 giờ chiều có tiện cho ông không? Vui lòng cho tôi biết thời gian rảnh của ông.',
      },
      {
        speaker: 'Email 1',
        text: 'Best regards, Sarah Thompson',
        translation: 'Trân trọng, Sarah Thompson',
      },
      {
        speaker: 'Email 2',
        text: 'Dear Sarah, Thank you for your email. Tuesday at 2 PM works perfectly for me.',
        translation: 'Sarah thân mến, Cảm ơn email của bạn. Thứ Ba lúc 2 giờ chiều hoàn toàn phù hợp với tôi.',
      },
      {
        speaker: 'Email 2',
        text: 'I\'ve sent you a calendar invitation. See you then! Regards, Michael Johnson',
        translation: 'Tôi đã gửi cho bạn lời mời lịch. Hẹn gặp bạn lúc đó! Trân trọng, Michael Johnson',
      },
    ],
  },
];
