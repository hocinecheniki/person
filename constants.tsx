
import { Tutor, Subject, Availability } from './types';

export const SUBJECTS: Subject[] = [
  'الرياضيات',
  'الفيزياء',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'البرمجة',
  'العلوم'
];

const DEFAULT_SLOTS = ["04:00 مساءً", "05:00 مساءً", "06:00 مساءً", "07:00 مساءً"];

export const MOCK_TUTORS: Tutor[] = [
  {
    id: '1',
    name: 'د. أحمد علي',
    specialty: 'الرياضيات المتقدمة',
    bio: 'خبير في تدريس الرياضيات للثانوية العامة والجامعات لأكثر من 10 سنوات.',
    rating: 4.9,
    reviewsCount: 124,
    hourlyRate: 50,
    avatar: 'https://picsum.photos/seed/tutor1/200',
    subjects: ['الرياضيات', 'الفيزياء'],
    availability: [
      { day: 'الاثنين', slots: DEFAULT_SLOTS },
      { day: 'الأربعاء', slots: DEFAULT_SLOTS }
    ],
    reviews: [
      { id: 'r1', studentName: 'ياسر خالد', rating: 5, comment: 'شرح ممتاز ومبسط جداً!', date: '2024-05-01' }
    ]
  },
  {
    id: '2',
    name: 'أ. سارة محمود',
    specialty: 'اللغة الإنجليزية',
    bio: 'متخصصة في التحضير لاختبارات IELTS و TOEFL بأساليب تفاعلية حديثة.',
    rating: 4.8,
    reviewsCount: 89,
    hourlyRate: 40,
    avatar: 'https://picsum.photos/seed/tutor2/200',
    subjects: ['اللغة الإنجليزية'],
    availability: [
      { day: 'الأحد', slots: DEFAULT_SLOTS },
      { day: 'الثلاثاء', slots: DEFAULT_SLOTS }
    ],
    reviews: []
  },
  {
    id: '3',
    name: 'المهندس خالد حسن',
    specialty: 'تطوير الويب والبرمجة',
    bio: 'مطور واجهات أمامية، أساعد الطلاب على بناء مشاريعهم البرمجية الأولى.',
    rating: 5.0,
    reviewsCount: 45,
    hourlyRate: 60,
    avatar: 'https://picsum.photos/seed/tutor3/200',
    subjects: ['البرمجة'],
    availability: [
      { day: 'السبت', slots: DEFAULT_SLOTS },
      { day: 'الخميس', slots: DEFAULT_SLOTS }
    ],
    reviews: []
  }
];
