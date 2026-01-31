
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import TutorCard from './components/TutorCard';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Classroom from './components/Classroom';
import SchedulePicker from './components/SchedulePicker';
import { Tutor, Appointment, Subject, UserProfile } from './types';
import { MOCK_TUTORS, SUBJECTS } from './constants';
import { getTutorRecommendation } from './services/geminiService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'search' | 'dashboard' | 'profile'>('search');
  const [inClassroom, setInClassroom] = useState<{ active: boolean; partnerName: string }>({ active: false, partnerName: '' });
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'الكل'>('الكل');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ tutorId: string; reasoning: string } | null>(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user);
      else {
        setCurrentUser(null);
        setAppointments([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: any) => {
    try {
      setLoading(true);
      const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profile) {
        setCurrentUser(profile);
      } else {
        const newProfile: UserProfile = {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          email: authUser.email,
          role: authUser.user_metadata?.role || 'student',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
          walletBalance: 300 
        };
        // محاولة الحفظ الأولي في Supabase
        await supabase!.from('profiles').insert([newProfile]);
        setCurrentUser(newProfile);
      }
      
      const { data: apps } = await supabase!
        .from('appointments')
        .select('*')
        .or(`studentId.eq.${authUser.id},tutorId.eq.${authUser.id}`)
        .order('date', { ascending: true });
      
      if (apps) setAppointments(apps);
    } catch (e) {
      console.error("Supabase Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = useMemo(() => {
    return MOCK_TUTORS.filter(tutor => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = tutor.name.toLowerCase().includes(query) || 
                            tutor.specialty.toLowerCase().includes(query) ||
                            tutor.bio.toLowerCase().includes(query);
      const matchesSubject = selectedSubject === 'الكل' || tutor.subjects.includes(selectedSubject as Subject);
      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  const handleBookingConfirm = async (date: string, time: string) => {
    if (!currentUser || !bookingTutor) return;
    
    const newApp: Partial<Appointment> = {
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

    try {
      const { data, error } = await supabase!.from('appointments').insert([newApp]).select().single();
      if (error) throw error;
      
      setAppointments([data as Appointment, ...appointments]);
      
      // تحديث المحفظة في Supabase
      const newBalance = currentUser.walletBalance - bookingTutor.hourlyRate;
      await supabase!.from('profiles').update({ walletBalance: newBalance }).eq('id', currentUser.id);
      
      setCurrentUser({ ...currentUser, walletBalance: newBalance });
      setBookingTutor(null);
      setView('dashboard');
    } catch (err) {
      console.error("Booking Error:", err);
      alert("حدث خطأ أثناء الحجز. يرجى المحاولة لاحقاً.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-indigo-900 font-tajawal animate-pulse">جاري الاتصال بـ Supabase...</h2>
      </div>
    );
  }

  if (inClassroom.active) {
    return <Classroom partnerName={inClassroom.partnerName} onExit={() => setInClassroom({ active: false, partnerName: '' })} />;
  }

  if (!session || !currentUser) {
    return <Auth onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        onNavClick={setView} 
        onRoleToggle={async () => {
          const newRole = currentUser.role === 'student' ? 'tutor' : 'student';
          await supabase!.from('profiles').update({ role: newRole }).eq('id', currentUser.id);
          setCurrentUser({...currentUser, role: newRole});
        }} 
        onLogout={() => supabase?.auth.signOut()} 
        activeView={view} 
        user={currentUser} 
      />
      
      <div className="flex-1">
        {view === 'search' ? (
          <main>
            <section className="hero-gradient text-white pt-24 pb-44 px-4 relative overflow-hidden">
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
              </div>

              <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-8 border border-white/20 animate-fade-in shadow-xl">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-white text-xs font-black font-tajawal uppercase tracking-widest">المعلمين متصلون الآن</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[1.1] font-tajawal drop-shadow-2xl">
                  مستقبلك يبدأ مع <br/> <span className="text-indigo-300">أستاذك المثالي</span>
                </h1>
                
                <p className="text-xl text-indigo-100/90 mb-14 max-w-2xl mx-auto font-medium leading-relaxed italic">
                  اختر من بين أفضل الكفاءات التعليمية واستعد لرحلة تعلم استثنائية مدعومة بالذكاء الاصطناعي.
                </p>
                
                <div className="max-w-4xl mx-auto glass-card p-3 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex items-center px-8">
                    <svg className="w-7 h-7 text-indigo-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="عن ماذا تريد أن تسأل اليوم؟" 
                      className="w-full bg-transparent py-6 rounded-2xl text-slate-800 focus:outline-none font-bold text-xl placeholder:text-slate-300" 
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      if (!searchQuery) return;
                      setAiLoading(true);
                      const rec = await getTutorRecommendation(searchQuery, MOCK_TUTORS);
                      if (rec) setAiRecommendation(rec);
                      setAiLoading(false);
                    }} 
                    disabled={aiLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-14 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-900/30 font-tajawal"
                  >
                    {aiLoading ? <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div> : 'استشارة ذكية'}
                  </button>
                </div>
              </div>
            </section>

            {/* AI Recommendation */}
            {aiRecommendation && (
              <div className="max-w-4xl mx-auto -mt-24 relative z-20 px-4">
                <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-b-8 border-indigo-600 flex flex-col md:flex-row items-center gap-12 animate-in slide-in-from-bottom duration-1000">
                  <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 animate-float">
                    <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h4 className="font-black text-indigo-900 text-3xl mb-4 font-tajawal">مساعدك الذكي وجد الحل!</h4>
                    <p className="text-slate-600 leading-relaxed text-xl font-medium italic mb-8">"{aiRecommendation.reasoning}"</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-5">
                       <button onClick={() => {
                         const tutor = MOCK_TUTORS.find(t => t.id === aiRecommendation.tutorId);
                         if (tutor) setBookingTutor(tutor);
                       }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100">احجز الآن</button>
                       <button onClick={() => setAiRecommendation(null)} className="text-slate-300 hover:text-slate-500 font-bold px-6 py-4">إغلاق التوصية</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <section className="max-w-7xl mx-auto px-4 py-28">
              <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
                 <div>
                    <h2 className="text-5xl font-black text-slate-900 font-tajawal mb-4">اكتشف المعلمين</h2>
                    <p className="text-slate-500 font-bold text-lg">تصفح نخبة المعلمين المتخصصين في كافة المجالات</p>
                 </div>
                 
                 <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar w-full md:w-auto">
                  <button onClick={() => setSelectedSubject('الكل')} className={`whitespace-nowrap px-10 py-5 rounded-3xl text-sm font-black transition-all ${selectedSubject === 'الكل' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}>الكل</button>
                  {SUBJECTS.map(s => (
                    <button key={s} onClick={() => setSelectedSubject(s)} className={`whitespace-nowrap px-10 py-5 rounded-3xl text-sm font-black transition-all ${selectedSubject === s ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {filteredTutors.map(tutor => (
                  <TutorCard 
                    key={tutor.id} 
                    tutor={tutor} 
                    onBook={setBookingTutor} 
                    isRecommended={aiRecommendation?.tutorId === tutor.id} 
                  />
                ))}
              </div>
            </section>
          </main>
        ) : view === 'dashboard' ? (
          <Dashboard appointments={appointments} user={currentUser} onJoinRoom={(name) => setInClassroom({active: true, partnerName: name})} />
        ) : (
          <Profile user={currentUser} onUpdate={(updated) => {
            setCurrentUser(updated);
            supabase!.from('profiles').update(updated).eq('id', currentUser.id);
          }} />
        )}
      </div>

      {bookingTutor && (
        <SchedulePicker 
          tutor={bookingTutor} 
          userBalance={currentUser.walletBalance} 
          onCancel={() => setBookingTutor(null)} 
          onConfirm={handleBookingConfirm} 
        />
      )}
      
      <footer className="bg-indigo-950 text-indigo-100 py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-right">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-950 font-black text-3xl">أ</div>
              <span className="text-4xl font-black text-white font-tajawal">أستاذي</span>
            </div>
            <p className="text-indigo-300 font-bold max-w-sm">المنصة التعليمية الأولى لربط الطلاب بأفضل الكفاءات في العالم العربي.</p>
          </div>
          <div className="flex gap-16 text-sm font-bold">
            <div className="space-y-4">
              <a href="#" className="block hover:text-white">عن المنصة</a>
              <a href="#" className="block hover:text-white">انضم كمعلم</a>
              <a href="#" className="block hover:text-white">الأسعار</a>
            </div>
            <div className="space-y-4">
              <a href="#" className="block hover:text-white">سياسة الخصوصية</a>
              <a href="#" className="block hover:text-white">الشروط والأحكام</a>
              <a href="#" className="block hover:text-white">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
