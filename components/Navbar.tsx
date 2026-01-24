
import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  onNavClick: (view: 'search' | 'dashboard' | 'profile') => void;
  onRoleToggle: () => void;
  onLogout: () => void;
  activeView: string;
  user: UserProfile;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, onRoleToggle, onLogout, activeView, user }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick('search')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">أ</div>
              <span className="text-2xl font-bold text-gray-900 font-tajawal">أستاذي</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-reverse space-x-6">
              <button 
                onClick={() => onNavClick('search')}
                className={`${activeView === 'search' ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-500'} transition-colors`}
              >
                {user.role === 'student' ? 'البحث عن معلمين' : 'الرئيسية'}
              </button>
              <button 
                onClick={() => onNavClick('dashboard')}
                className={`${activeView === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-indigo-500'} transition-colors`}
              >
                {user.role === 'student' ? 'مواعيدي' : 'لوحة التحكم'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onRoleToggle}
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all"
            >
              <span>تبديل إلى {user.role === 'student' ? 'معلم' : 'طالب'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavClick('profile')}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all ${activeView === 'profile' ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                </div>
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />
              </button>

              <button 
                onClick={onLogout}
                className="text-gray-400 hover:text-red-500 transition-all"
                title="تسجيل الخروج"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
