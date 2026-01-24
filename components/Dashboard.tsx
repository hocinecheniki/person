
import React from 'react';
import { Appointment, UserProfile } from '../types';

interface DashboardProps {
  appointments: Appointment[];
  user: UserProfile;
  onJoinRoom: (partnerName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, user, onJoinRoom }) => {
  const isTutor = user.role === 'tutor';
  const filteredApps = isTutor 
    ? appointments.filter(a => a.tutorId === user.id)
    : appointments.filter(a => a.studentId === user.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 font-tajawal mb-2">
            {isTutor ? 'لوحة تحكم المعلم' : 'مرحباً بك، استعد للتعلم!'}
          </h1>
          <p className="text-gray-500 font-medium">إليك نظرة عامة على نشاطك ومواعيدك القادمة.</p>
        </div>
        
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-indigo-100 flex items-center gap-6">
          <div className="flex items-center gap-3 pr-2">
            <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-indigo-50" alt="User" />
            <div>
              <p className="font-bold text-gray-900 leading-none mb-1">{user.name}</p>
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                {isTutor ? 'معلم معتمد' : 'طالب مجتهد'}
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <div className="pl-2">
            <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{isTutor ? 'إجمالي الأرباح' : 'محفظتك الذكية'}</p>
            <p className="text-2xl font-black text-green-600">${user.walletBalance}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-gray-500 text-xs font-bold mb-1">المواعيد النشطة</p>
          <p className="text-3xl font-black text-gray-900">{filteredApps.filter(a => a.status === 'upcoming').length}</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-gray-500 text-xs font-bold mb-1">ساعات مكتملة</p>
          <p className="text-3xl font-black text-gray-900">32</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <p className="text-gray-500 text-xs font-bold mb-1">معدل التقييم</p>
          <p className="text-3xl font-black text-gray-900">4.9</p>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-100 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-white/70 text-xs font-bold mb-1">رسائل جديدة</p>
          <p className="text-3xl font-black">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-tajawal">الجدول الزمني</h2>
            <button className="text-indigo-600 text-sm font-bold hover:underline">عرض كل المواعيد</button>
          </div>
          
          {filteredApps.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-gray-400 font-bold max-w-xs">
                {isTutor ? 'ليس لديك أي طلاب حالياً. قم بتحديث ملفك لجذب المزيد!' : 'لا يوجد لديك أي مواعيد حالياً. ابدأ بالبحث عن معلمك المثالي الآن!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-5">
                    <img src={`https://i.pravatar.cc/150?u=${isTutor ? app.studentId : app.tutorId}`} className="w-14 h-14 rounded-2xl border-2 border-indigo-50" />
                    <div>
                      <p className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">{isTutor ? app.studentName : app.tutorName}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.type === 'trial' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {app.type === 'trial' ? 'حصة تجريبية' : 'حصة مدفوعة'}
                         </span>
                         <span className="text-gray-300">•</span>
                         <p className="text-gray-400 text-xs font-bold">${app.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tighter">تاريخ الحصة</span>
                      <span className="font-black text-gray-700">{app.date}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tighter">الوقت</span>
                      <span className="font-black text-gray-700">{app.time}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-12 h-12 flex items-center justify-center border-2 border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-all">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </button>
                    <button 
                      onClick={() => onJoinRoom(isTutor ? app.studentName : app.tutorName)}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >
                      دخول الفصل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
           {/* Sidebar: Smart Advisor Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-4 font-tajawal relative z-10">تحليل مسارك التعليمي</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed relative z-10">
                بناءً على نشاطك الأخير، نوصيك بتعزيز مهاراتك في "الخوارزميات" مع الأستاذ خالد.
              </p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all relative z-10">
                مشاهدة الخطة المقترحة
              </button>
           </div>

           {/* Quick Stats / Wallet Summary */}
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                 <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                 {isTutor ? 'إحصائيات الأداء' : 'المحفظة المالية'}
              </h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-bold">{isTutor ? 'ساعات معتمدة' : 'الرصيد المتاح'}</span>
                    <span className="font-black text-indigo-600">{isTutor ? '128 ساعة' : `$${user.walletBalance}`}</span>
                 </div>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[70%] rounded-full"></div>
                 </div>
                 <button className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">
                    {isTutor ? 'سحب الأرباح' : 'شحن الرصيد'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
