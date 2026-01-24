
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthProps {
  onRegister: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onRegister }) => {
  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Adding walletBalance to comply with UserProfile interface
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: selectedRole!,
      avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
      specialty: selectedRole === 'tutor' ? formData.specialty : undefined,
      bio: selectedRole === 'tutor' ? 'معلم جديد في المنصة' : undefined,
      hourlyRate: selectedRole === 'tutor' ? 30 : undefined,
      walletBalance: 0,
    };
    onRegister(newUser);
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg">أ</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-tajawal">مرحباً بك في أستاذي</h1>
            <p className="text-xl text-gray-600">من فضلك اختر نوع الحساب للبدء</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => handleRoleSelect('student')}
              className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500 text-right flex flex-col items-center md:items-start"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">أنا طالب</h2>
              <p className="text-gray-500">أبحث عن معلمين متميزين لتطوير مهاراتي الدراسية.</p>
            </button>

            <button 
              onClick={() => handleRoleSelect('tutor')}
              className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500 text-right flex flex-col items-center md:items-start"
            >
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">أنا معلم</h2>
              <p className="text-gray-500">أرغب في تقديم دروس خصوصية ومساعدة الطلاب على النجاح.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => setStep('selection')}
          className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:gap-3 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          الرجوع لاختيار النوع
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h2>
          <p className="text-gray-500 mb-8">
            التسجيل كـ {selectedRole === 'student' ? 'طالب' : 'معلم'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الاسم بالكامل</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                required
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="example@mail.com"
              />
            </div>

            {selectedRole === 'tutor' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التخصص</label>
                <input 
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                  placeholder="مثلاً: رياضيات، لغة إنجليزية"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input 
                required
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              إنشاء الحساب
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
