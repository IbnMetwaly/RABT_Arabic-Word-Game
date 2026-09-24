import React, { useState, useEffect } from 'react';

export const OfflineNotification: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs py-1.5 px-3 flex items-center justify-center gap-2 font-bold shadow-md z-50 animate-in slide-in-from-top duration-300">
      <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping" />
      <span>وضع اللعب أوفلاين (بدون إنترنت) • الألغاز التراثية تعمل بكفاءة تامة</span>
    </div>
  );
};
