
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  onAuthSuccess: (user: UserProfile) => void;
  externalError?: string | null;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, externalError }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'selection' | 'form' | 'verification'>('selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
  });

  useEffect(() => {
    if (externalError) {
      setError(externalError);
      if (externalError.includes('expired') || externalError.includes('invalid')) {
        setStep('verification');
      }
    }
  }, [externalError]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
    setError(null);
  };

  const handleResendEmail = async () => {
    if (!supabase || !formData.email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً.");
      setStep('form');
      return;
    }
    setResending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      alert("تم إعادة إرسال رابط التفعيل. يرجى التحقق من البريد الوارد و Junk/Spam.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleDemoLogin = () => {
    const role = selectedRole || 'student';
    const demoUser: UserProfile = {
      id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
      name: formData.name || (role === 'student' ? 'طالب تجريبي' : 'معلم تجريبي'),
      email: formData.email || 'demo@example.com',
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`,
      specialty: role === 'tutor' ? 'رياضيات' : undefined,
      walletBalance: role === 'student' ? 500 : 0
    };
    onAuthSuccess(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { 
            data: { full_name: formData.name, role: selectedRole },
            emailRedirectTo: window.location.origin // إخبار Supabase بالعودة لهذا الموقع
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          if (data.session === null) {
            setStep('verification');
          } else {
            const profile: UserProfile = {
              id: data.user.id,
              name: formData.name,
              email: formData.email,
              role: selectedRole!,
              avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
              walletBalance: selectedRole === 'student' ? 200 : 0
            };
            await supabase.from('profiles').insert([profile]);
            onAuthSuccess(profile);
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          if (signInError.message.includes("Email not confirmed")) {
            setStep('verification');
            return;
          }
          throw signInError;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-indigo-50">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 ${error ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-4 font-tajawal">
            {error ? 'انتهت صلاحية الرابط' : 'تحقق من بريدك!'}
          </h2>
          
          <p className="text-gray-500 mb-6 leading-relaxed font-tajawal">
            {error 
              ? "يبدو أن الرابط انتهى. اطلب واحداً جديداً بالأسفل."
              : `لقد أرسلنا الرابط إلى ${formData.email}. إذا لم تجده، تفقد مجلد Junk/Spam.`
            }
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-right">
            <h4 className="text-amber-800 text-xs font-bold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
              ملاحظة هامة للمطور:
            </h4>
            <p className="text-amber-700 text-[10px] leading-relaxed">
              إذا لم يصلك الإيميل نهائياً، يرجى الذهاب إلى لوحة تحكم Supabase:
              <br/>
              <span className="font-mono bg-white/50 px-1">Authentication -> Providers -> Email</span>
              <br/>
              وتأكد من تفعيل <strong>Confirm Email</strong> أو قم بإلغاء تفعيله للتجربة الفورية بدون إيميل.
            </p>
          </div>

          <div className="space-y-4">
            <button disabled={resending} onClick={handleResendEmail} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 font-tajawal">
              {resending ? 'جاري الإرسال...' : 'إرسال رابط جديد'}
            </button>
            <button onClick={() => { setStep('form'); setError(null); }} className="w-full bg-white border-2 border-gray-100 text-gray-500 py-3 rounded-2xl font-bold hover:bg-gray-50 font-tajawal">
              العودة وتغيير البريد
            </button>
            <button onClick={handleDemoLogin} className="w-full text-indigo-600 font-bold text-sm py-2 hover:underline font-tajawal">
              الدخول بوضع التجربة الآن
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {mode === 'register' && step === 'selection' ? (
        <div className="max-w-4xl w-full">
           <div className="text-center mb-12">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-lg">أ</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-tajawal">مرحباً بك في أستاذي</h1>
            <p className="text-xl text-gray-600 mb-4 font-tajawal">اختر نوع الحساب للبدء</p>
            <button onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline font-tajawal">لديك حساب بالفعل؟ سجل دخولك</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleRoleSelect('student')} className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500 text-right flex flex-col items-center md:items-start">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-tajawal">أنا طالب</h2>
              <p className="text-gray-500 font-tajawal">أبحث عن معلمين متميزين لتطوير مهاراتي الدراسية.</p>
            </button>
            <button onClick={() => handleRoleSelect('tutor')} className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500 text-right flex flex-col items-center md:items-start">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-tajawal">أنا معلم</h2>
              <p className="text-gray-500 font-tajawal">أرغب في تقديم دروس خصوصية ومساعدة الطلاب على النجاح.</p>
            </button>
          </div>
          <div className="mt-8 text-center">
            <button onClick={handleDemoLogin} className="text-gray-400 hover:text-indigo-600 text-sm font-bold font-tajawal">تخطي واستخدام وضع التجربة</button>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full">
          <button onClick={() => { setStep('selection'); setMode('login'); setError(null); }} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:gap-3 transition-all font-tajawal">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" /></svg>
            الرجوع للرئيسية
          </button>
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-tajawal">{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 text-right">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 font-tajawal">الاسم بالكامل</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="أدخل اسمك الكامل" />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-tajawal">البريد الإلكتروني</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@mail.com" />
              </div>
              {mode === 'register' && selectedRole === 'tutor' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 font-tajawal">التخصص</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="مثلاً: رياضيات" />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 font-tajawal">كلمة المرور</label>
                <input required type="password" underline-none className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <div className="space-y-3">
                <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 font-tajawal">
                  {loading ? 'جاري المعالجة...' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
                </button>
                <button type="button" onClick={handleDemoLogin} className="w-full bg-white border-2 border-gray-100 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all font-tajawal">
                  الدخول السريع (وضع التجربة)
                </button>
              </div>
              {mode === 'login' && (
                <p className="text-center text-sm text-gray-500 mt-4 font-tajawal">ليس لديك حساب؟ <button type="button" onClick={() => { setMode('register'); setStep('selection'); setError(null); }} className="text-indigo-600 font-bold">سجل الآن</button></p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
