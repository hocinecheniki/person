
import React from 'react';
import { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
  onBook: (tutor: Tutor) => void;
  isRecommended?: boolean;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBook, isRecommended }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 group ${isRecommended ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-gray-50 hover:border-indigo-100'}`}>
      {isRecommended && (
        <div className="bg-indigo-600 text-white text-[10px] font-black py-2 px-3 flex justify-center items-center gap-2 uppercase tracking-widest">
          <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
          <span>الأكثر توافقاً مع احتياجك</span>
        </div>
      )}
      <div className="p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="relative">
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className="w-20 h-20 rounded-3xl object-cover border-4 border-indigo-50 shadow-sm transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-2 -left-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm" title="متاح حالياً"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 leading-none mb-2 font-tajawal">{tutor.name}</h3>
            <p className="text-indigo-600 text-xs font-black uppercase tracking-wider">{tutor.specialty}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex bg-orange-50 px-2 py-0.5 rounded-lg items-center gap-1">
                <span className="text-orange-400 text-xs">★</span>
                <span className="font-black text-orange-600 text-xs">{tutor.rating}</span>
              </div>
              <span className="text-gray-300 text-xs font-bold">({tutor.reviewsCount} مراجعة)</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium italic">
          "{tutor.bio}"
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tutor.subjects.map(s => (
            <span key={s} className="bg-gray-50 text-gray-400 border border-gray-100 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">السعر / ساعة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900">${tutor.hourlyRate}</span>
              <span className="text-gray-400 text-xs font-bold">USD</span>
            </div>
          </div>
          <button 
            onClick={() => onBook(tutor)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group-hover:translate-x-[-4px]"
          >
            حجز الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
