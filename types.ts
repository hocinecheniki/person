
export type UserRole = 'student' | 'tutor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  specialty?: string;
  hourlyRate?: number;
  subjects?: string[];
  walletBalance: number;
}

export interface Availability {
  day: string;
  slots: string[];
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  avatar: string;
  subjects: string[];
  availability: Availability[];
  reviews: Review[];
}

export interface Appointment {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'trial' | 'regular';
  price: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export type Subject = 'الرياضيات' | 'الفيزياء' | 'اللغة العربية' | 'اللغة الإنجليزية' | 'البرمجة' | 'العلوم';
