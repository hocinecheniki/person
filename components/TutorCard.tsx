
import React from 'react';
import { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
  onBook: (tutor: Tutor) => void;
  isRecommended?: boolean;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBook, isRecommended }) => {
  return (
    <div className={`bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border-2 group relative ${isRecommended ? 'border-indigo-500 ring-8 ring-indigo-50' : 'border-transparent hover:border-indigo-100'}`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 left-0 bg-indigo-600 text-white text-[10px] font-black py-2.5 px-3 flex justify-center items-center gap-2 uppercase tracking-widest z-10">
          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span className="font-tajawal">التوصية الأذكى لك</span>
        </div>
      )}
      <div className="p-10 pt-12">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-100 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className="relative w-28 h-28 rounded-[2.5rem] object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105 duration-500"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse" title="متاح حالياً"></div>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1 font-tajawal group-hover:text-indigo-600 transition-colors">{tutor.name}</h3>
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{tutor.specialty}</p>
          
          <div className="flex items-center gap-1.5 mt-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <div className="flex text-orange-400">
               {[...Array(5)].map((_, i) => (
                 <svg key={i} className={`w-3 h-3 ${i < Math.floor(tutor.rating) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
               ))}
            </div>
            <span className="font-black text-slate-700 text-[10px]">{tutor.rating}</span>
            <span className="text-slate-400 text-[10px] font-bold">({tutor.reviewsCount} تقييم)</span>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm leading-relaxed text-center mb-8 font-medium line-clamp-2 italic px-4">
          "{tutor.bio}"
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tutor.subjects.map(s => (
            <span key={s} className="bg-slate-50 text-slate-500 border border-slate-100 px-4 py-1.5 rounded-xl text-[10px] font-black transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 pt-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">السعر / ساعة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-indigo-900">${tutor.hourlyRate}</span>
              <span className="text-slate-400 text-xs font-bold uppercase">usd</span>
            </div>
          </div>
          <button 
            onClick={() => onBook(tutor)}
            className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 font-tajawal"
          >
            احجز الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
