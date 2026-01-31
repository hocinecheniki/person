
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase!
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      onUpdate(formData);
      alert('تم تحديث ملفك الشخصي بنجاح!');
    } catch (err: any) {
      alert('حدث خطأ أثناء التحديث: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 h-48 relative">
          <div className="absolute -bottom-16 right-12">
            <div className="relative group">
               <img 
                src={formData.avatar} 
                className="w-32 h-32 rounded-[2.5rem] border-8 border-white object-cover shadow-2xl transition-transform group-hover:scale-105"
                alt="Avatar"
              />
              <button className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity flex items-center justify-center text-white font-bold text-xs">تغيير الصورة</button>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 pt-24 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 font-tajawal mb-2">تعديل الملف الشخصي</h2>
            <p className="text-slate-400 font-bold text-sm">أكمل بياناتك ليتمكن الطلاب/المعلمون من التعرف عليك بشكل أفضل.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700 font-tajawal pr-1">الاسم بالكامل</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold bg-slate-50 text-slate-800"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black text-slate-700 font-tajawal pr-1">البريد الإلكتروني</label>
              <input 
                type="email"
                disabled
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          {user.role === 'tutor' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-slate-700 font-tajawal pr-1">التخصص الرئيسي</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold bg-slate-50 text-slate-800"
                    value={formData.specialty || ''}
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-slate-700 font-tajawal pr-1">سعر الساعة ($)</label>
                  <input 
                    type="number"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold bg-slate-50 text-slate-800"
                    value={formData.hourlyRate || 0}
                    onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700 font-tajawal pr-1">نبذة تعريفية (Bio)</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold bg-slate-50 text-slate-800 resize-none"
                  value={formData.bio || ''}
                  placeholder="أخبر الطلاب عن خبراتك وأسلوبك التعليمي..."
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}

          <div className="pt-8">
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {saving ? <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></div> : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
