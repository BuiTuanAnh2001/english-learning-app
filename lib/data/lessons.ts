import { Category, Lesson } from '../types';

// Categories for the English learning app
export const categories: Category[] = [
  {
    id: 'daily',
    name: 'Giao tiếp hàng ngày',
    description: 'Học các cụm từ và hội thoại thường ngày',
    icon: '💬',
    lessonCount: 12,
  },
  {
    id: 'business',
    name: 'Tiếng Anh thương mại',
    description: 'Tiếng Anh cho công việc và kinh doanh',
    icon: '💼',
    lessonCount: 8,
  },
  {
    id: 'travel',
    name: 'Tiếng Anh du lịch',
    description: 'Giao tiếp khi đi du lịch nước ngoài',
    icon: '✈️',
    lessonCount: 10,
  },
  {
    id: 'beginner',
    name: 'Dành cho người mới',
    description: 'Các bài học cơ bản cho người mới bắt đầu',
    icon: '🎯',
    lessonCount: 15,
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
];
