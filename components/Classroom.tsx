
import React, { useState, useEffect, useRef } from 'react';

interface ClassroomProps {
  onExit: () => void;
  partnerName: string;
}

const Classroom: React.FC<ClassroomProps> = ({ onExit, partnerName }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(err => console.error("Camera access denied", err));

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center text-white border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">أ</div>
          <div>
            <h2 className="font-bold">فصل تعليمي مباشر: {partnerName}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> جاري الاتصال...
            </p>
          </div>
        </div>
        <button onClick={onExit} className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl font-bold transition-all">
          إنهاء الحصة
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        {/* Tutor/Student Video */}
        <div className="flex-1 bg-black rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <img src={`https://i.pravatar.cc/150?u=${partnerName}`} className="w-32 h-32 rounded-full border-4 border-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">في انتظار انضمام {partnerName}...</p>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 bg-gray-800/80 backdrop-blur p-2 rounded-lg text-white text-xs font-bold">
            {partnerName} (عن بعد)
          </div>
        </div>

        {/* Self Video */}
        <div className="w-full md:w-64 aspect-video md:aspect-auto bg-gray-800 rounded-3xl overflow-hidden relative border-2 border-indigo-500/30">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute bottom-4 right-4 bg-indigo-600/80 backdrop-blur px-2 py-1 rounded-md text-white text-[10px] font-bold">
            أنت
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6 flex justify-center items-center gap-8">
        <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </button>
        <button className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 shadow-xl shadow-indigo-900/40 scale-110">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Classroom;
