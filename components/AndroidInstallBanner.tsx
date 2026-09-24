import React, { useState } from 'react';
import { usePWAInstall } from '../usePWAInstall';

interface AndroidInstallBannerProps {
  variant?: 'banner' | 'button';
}

export const AndroidInstallBanner: React.FC<AndroidInstallBannerProps> = () => {
  return null;
};

  function renderModals() {
    return (
      <>
        {/* Android Installation Instructions Modal */}
        {showAndroidGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-200 text-right overflow-hidden relative">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl shadow-inner">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800">تثبيت اللعبة على أندرويد</h3>
                    <p className="text-[11px] text-slate-500 font-bold">تطبيق خفيف، سريع وبدون إعلانات</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm">
                    ١
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">اضغط على زر القائمة في متصفحك</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      انقر على رمز النقاط الثلاث <strong className="text-amber-700 font-black font-mono">⋮</strong> (أو زر المشاركة في أسفل/أعلى الشاشة).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm">
                    ٢
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">اختر «تثبيت التطبيق» أو «إضافة للشاشة الرئيسية»</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      (Install app أو Add to Home screen).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-sky-50 p-3 rounded-2xl border border-sky-200">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-sm">
                    ٣
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">استمتع بتطبيق مستقل وممتع</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ستظهر أيقونة «رَبْط» في قائمة تطبيقات هاتفك، وتعمل دون شريط عنوان وبدعم اللعب دون اتصال بالإنترنت!
                    </p>
                  </div>
                </div>
              </div>

              {isInstallable && (
                <button
                  onClick={async () => {
                    await triggerInstall();
                    setShowAndroidGuide(false);
                  }}
                  className="w-full py-3 mb-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <span>🤖</span>
                  <span>اضغط هنا للتثبيت المباشر الآن</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAndroidGuide(false);
                    setShowApkGuide(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                >
                  📦 حزمة APK / متجر Play
                </button>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APK / Google Play Export Guide Modal */}
        {showApkGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-200 text-right relative">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shadow-inner">
                    📦
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-800">تصدير ملف APK للأندرويد</h3>
                    <p className="text-[11px] text-slate-500 font-bold">جاهز لـ Google Play و التثبيت المباشر</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApkGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 space-y-3 mb-5 leading-relaxed">
                <p className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-slate-800">
                  تم تجهيز التطبيق بملف <strong className="text-amber-800">Web App Manifest</strong> وأيقونات أندرويد التكيفية (Adaptive Maskable Icons) وخدمة أوفلاين كاملة.
                </p>

                <p className="font-bold text-slate-800">كيف تحوّله إلى ملف APK جاهز للتثبيت بضغطة زر؟</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pr-1">
                  <li>
                    توجه إلى موقع <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-black underline">PWABuilder.com</a> (من مايكروسوفت).
                  </li>
                  <li>
                    ضع رابط هذا التطبيق واضغط <span className="font-bold">Start</span>.
                  </li>
                  <li>
                    اضغط على <span className="text-emerald-700 font-black">Package for Android</span> لتنزيل ملف <strong className="font-mono">.apk</strong> أو حزمة <strong className="font-mono">.aab</strong> لنشرها مباشرة في متجر Google Play!
                  </li>
                </ol>
              </div>

              <button
                onClick={() => setShowApkGuide(false)}
                className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md cursor-pointer transition-colors"
              >
                فهمت ذلك، شكراً!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-3.5 sm:p-4 shadow-lg border-2 border-emerald-400/40 flex items-center justify-between gap-3 text-right">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base leading-tight">تطبيق أندرويد الرسمي</span>
              <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                PWA / APK
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-100/90 font-bold mt-0.5">
              ثبّت لعبة «رَبْط» على هاتفك للعب دون إنترنت وبكامل الشاشة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm py-2 px-3.5 sm:px-4 rounded-xl shadow-md border-b-2 border-emerald-950 active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>تثبيت</span>
          </button>

          <button
            onClick={() => setShowApkGuide(true)}
            className="bg-emerald-800/60 hover:bg-emerald-800 text-white p-2 rounded-xl text-xs border border-emerald-500/40 cursor-pointer transition-colors"
            title="حزمة APK ومتجر Play"
          >
            📦
          </button>
        </div>
      </div>

      {renderModals()}
    </>
  );
};
