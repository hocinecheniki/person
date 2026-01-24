
import React, { useState } from 'react';
import { Tutor, Availability } from '../types';

interface SchedulePickerProps {
  tutor: Tutor;
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
  userBalance: number;
}

const SchedulePicker: React.FC<SchedulePickerProps> = ({ tutor, onConfirm, onCancel, userBalance }) => {
  const [selectedDay, setSelectedDay] = useState<Availability | null>(tutor.availability[0] || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const canAfford = userBalance >= tutor.hourlyRate;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">حجز حصة مع {tutor.name}</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 mb-3">اختر اليوم المتاح:</p>
            <div className="flex gap-2">
              {tutor.availability.map((avail, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedDay(avail); setSelectedTime(null); }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${selectedDay?.day === avail.day ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                >
                  {avail.day}
                </button>
              ))}
            </div>
          </div>

          {selectedDay && (
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-500 mb-3">اختر الوقت:</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedDay.slots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${selectedTime === slot ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-100 hover:border-indigo-50 text-gray-600'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gray-500">تكلفة الحصة</p>
              <p className="text-xl font-bold text-gray-900">${tutor.hourlyRate}</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">رصيدك الحالي</p>
              <p className={`text-xl font-bold ${canAfford ? 'text-green-600' : 'text-red-500'}`}>${userBalance}</p>
            </div>
          </div>

          {!canAfford && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>
              عذراً، رصيدك غير كافٍ لإتمام هذا الحجز.
            </div>
          )}

          <button
            disabled={!selectedTime || !canAfford}
            onClick={() => onConfirm(selectedDay!.day, selectedTime!)}
            className="w-full bg-indigo-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            تأكيد الحجز والدفع
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePicker;
