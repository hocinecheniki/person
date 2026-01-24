
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import TutorCard from './components/TutorCard';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Classroom from './components/Classroom';
import SchedulePicker from './components/SchedulePicker';
import { Tutor, Appointment, Subject, UserProfile, UserRole } from './types';
import { MOCK_TUTORS, SUBJECTS } from './constants';
import { getTutorRecommendation } from './services/geminiService';

const App: React.FC = () => {
  // Persistence
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('ostazi_auth') === 'true');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ostazi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ostazi_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'search' | 'dashboard' | 'profile'>('search');
  const [inClassroom, setInClassroom] = useState<{ active: boolean; partnerName: string }>({ active: false, partnerName: '' });
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'الكل'>('الكل');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ tutorId: string; reasoning: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('ostazi_auth', String(isAuthenticated));
    localStorage.setItem('ostazi_user', JSON.stringify(currentUser));
    localStorage.setItem('ostazi_appointments', JSON.stringify(appointments));
  }, [isAuthenticated, currentUser, appointments]);

  const filteredTutors = useMemo(() => {
    return MOCK_TUTORS.filter(tutor => {
      const matchesSearch = tutor.name.includes(searchQuery) || tutor.specialty.includes(searchQuery);
      const matchesSubject = selectedSubject === 'الكل' || tutor.subjects.includes(selectedSubject as Subject);
      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  const handleRegister = (user: UserProfile) => {
    const userWithWallet = { ...user, walletBalance: user.role === 'student' ? 200 : 0 };
    setCurrentUser(userWithWallet);
    setIsAuthenticated(true);
    setView(user.role === 'tutor' ? 'dashboard' : 'search');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('ostazi_auth');
    localStorage.removeItem('ostazi_user');
    setView('search');
  };

  const handleBookInitiate = (tutor: Tutor) => {
    if (!currentUser) return;
    setBookingTutor(tutor);
  };

  const handleBookingConfirm = (date: string, time: string) => {
    if (!currentUser || !bookingTutor) return;

    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      tutorId: bookingTutor.id,
      tutorName: bookingTutor.name,
      studentId: currentUser.id,
      studentName: currentUser.name,
      date,
      time,
      status: 'upcoming',
      type: 'regular',
      price: bookingTutor.hourlyRate
    };

    setAppointments([...appointments, newApp]);
    setCurrentUser({
      ...currentUser,
      walletBalance: currentUser.walletBalance - bookingTutor.hourlyRate
    });
    setBookingTutor(null);
    setView('dashboard');
    alert(`تم الحجز بنجاح! تم خصم $${bookingTutor.hourlyRate} من رصيدك.`);
  };

  const handleAiAsk = async () => {
    if (!searchQuery) {
      alert('يرجى كتابة ما تبحث عنه أولاً (مثلاً: أحتاج معلم رياضيات يساعدني في التفاضل)');
      return;
    }
    setAiLoading(true);
    setAiRecommendation(null);
    try {
      const rec = await getTutorRecommendation(searchQuery, MOCK_TUTORS);
      if (rec) setAiRecommendation(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const newRole: UserRole = currentUser.role === 'student' ? 'tutor' : 'student';
    setCurrentUser({
      ...currentUser,
      role: newRole,
      id: newRole === 'tutor' ? 'tutor_999' : 'student_123',
      name: newRole === 'tutor' ? `أ. ${currentUser.name}` : currentUser.name.replace('أ. ', ''),
      specialty: newRole === 'tutor' ? 'معلم جديد' : undefined,
    });
    setView(newRole === 'tutor' ? 'dashboard' : 'search');
  };

  const enterClass = (partnerName: string) => {
    setInClassroom({ active: true, partnerName });
  };

  if (inClassroom.active) {
    return <Classroom partnerName={inClassroom.partnerName} onExit={() => setInClassroom({ active: false, partnerName: '' })} />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Auth onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavClick={setView} 
        onRoleToggle={toggleRole}
        onLogout={handleLogout}
        activeView={view} 
        user={currentUser} 
      />
      
      <div className="flex-1">
        {view === 'search' ? (
          <main>
            <section className="bg-indigo-900 text-white py-20 px-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="max-w-7xl mx-auto text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight font-tajawal">
                  منصة <span className="text-indigo-400 italic underline decoration-wavy underline-offset-8">أستاذي</span> <br/> رحلتك للتميز تبدأ هنا
                </h1>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-light">
                  نحن نربطك بأفضل المعلمين في العالم العربي لضمان تفوقك الدراسي في كل المجالات.
                </p>
                
                <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 border-4 border-indigo-400/20">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بماذا يمكننا مساعدتك اليوم؟ (مثلاً: أحتاج تقوية في البرمجة)..." 
                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                  <button 
                    onClick={handleAiAsk}
                    disabled={aiLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    اطلب مشورة الذكاء الاصطناعي
                  </button>
                </div>
              </div>
            </section>

            {aiRecommendation && (
              <div className="max-w-4xl mx-auto mt-[-30px] relative z-20 px-4">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-indigo-500 flex items-start gap-4 animate-in slide-in-from-top duration-500">
                  <div className="bg-indigo-600 p-4 rounded-2xl text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-indigo-900 text-lg mb-1 font-tajawal">تحليلنا لطلبك:</h4>
                    <p className="text-gray-700 leading-relaxed">{aiRecommendation.reasoning}</p>
                  </div>
                  <button onClick={() => setAiRecommendation(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}

            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedSubject('الكل')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedSubject === 'الكل' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200 hover:text-indigo-600'}`}>الكل</button>
                  {SUBJECTS.map(s => (
                    <button key={s} onClick={() => setSelectedSubject(s)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedSubject === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200 hover:text-indigo-600'}`}>{s}</button>
                  ))}
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                  <span className="text-indigo-600 font-bold ml-1">{filteredTutors.length}</span>
                  <span className="text-gray-500 text-sm">معلم متاح حالياً</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTutors.map(tutor => (
                  <TutorCard key={tutor.id} tutor={tutor} onBook={handleBookInitiate} isRecommended={aiRecommendation?.tutorId === tutor.id} />
                ))}
              </div>
            </section>
          </main>
        ) : view === 'dashboard' ? (
          <Dashboard appointments={appointments} user={currentUser} onJoinRoom={enterClass} />
        ) : (
          <Profile user={currentUser} onUpdate={setCurrentUser} />
        )}
      </div>

      {bookingTutor && (
        <SchedulePicker tutor={bookingTutor} userBalance={currentUser.walletBalance} onCancel={() => setBookingTutor(null)} onConfirm={handleBookingConfirm} />
      )}

      <footer className="bg-white border-t py-16 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
           <p className="text-gray-400 text-sm font-medium font-tajawal">صُنع بحب في العالم العربي © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
