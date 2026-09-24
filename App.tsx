
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Difficulty, GameLevel, AppState, Word, Category } from './types';
import { generateLevel } from './geminiService';
import { getFallbackLevel } from './fallbackLevels';
import { WordCard } from './components/WordCard';
import { Button } from './components/Button';
import { Confetti } from './components/Confetti';
import { CategoryModal } from './components/CategoryModal';
import { OfflineNotification } from './components/OfflineNotification';
import { ArabicParticleBackground } from './components/ArabicParticleBackground';
import { audioService } from './audioService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    gameState: 'LOBBY',
    currentLevel: null,
    currentLevelNumber: 1,
    selectedWordIds: [],
    mistakeCount: 0,
    timer: 0,
    activeHint: null,
    hintUsedCount: 0,
    isMuted: false,
    activeCategoryModal: null,
  });

  const [isWrongGroup, setIsWrongGroup] = useState(false);
  const [isSuccessGroup, setIsSuccessGroup] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Audio and User
  useEffect(() => {
    const savedUser = localStorage.getItem('rabt_user');
    const savedMute = localStorage.getItem('rabt_muted');
    
    const isMuted = savedMute === 'true';
    audioService.setMute(isMuted);

    if (savedUser) {
      setState(prev => ({ 
        ...prev, 
        user: JSON.parse(savedUser),
        isMuted
      }));
    } else {
      setState(prev => ({ ...prev, isMuted }));
    }
  }, []);

  const toggleMute = () => {
    const newMutedState = !state.isMuted;
    setState(prev => ({ ...prev, isMuted: newMutedState }));
    audioService.setMute(newMutedState);
    localStorage.setItem('rabt_muted', String(newMutedState));
  };

  const handleLogin = (username: string) => {
    const finalUsername = username.trim() || "لاعب";
    const newUser = {
      userId: Math.random().toString(36).substr(2, 9),
      username: finalUsername,
      currentLevel: Difficulty.BEGINNER,
      bestTimes: {
        [Difficulty.BEGINNER]: 0,
        [Difficulty.INTERMEDIATE]: 0,
        [Difficulty.EXPERT]: 0,
      }
    };
    localStorage.setItem('rabt_user', JSON.stringify(newUser));
    setState(prev => ({ ...prev, user: newUser }));
  };

  const handleGoToUsernameScreen = () => {
    setUsernameInput(state.user?.username || '');
    localStorage.removeItem('rabt_user');
    if (timerRef.current) clearInterval(timerRef.current);
    setState(prev => ({
      ...prev,
      user: null,
      gameState: 'LOBBY',
      currentLevel: null,
      selectedWordIds: [],
      activeHint: null,
      hintUsedCount: 0,
      activeCategoryModal: null
    }));
  };

  const triggerHaptic = (type: 'tap' | 'error' | 'success' | 'win') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'tap') navigator.vibrate(14);
        else if (type === 'error') navigator.vibrate([40, 50, 40]);
        else if (type === 'success') navigator.vibrate([30, 40, 30]);
        else if (type === 'win') navigator.vibrate([50, 60, 50, 60, 120]);
      } catch {
        // Vibration not supported on this platform
      }
    }
  };

  // Support Android hardware back button / swipe gesture to return to Lobby
  useEffect(() => {
    const handlePopState = () => {
      if (state.gameState !== 'LOBBY') {
        if (timerRef.current) clearInterval(timerRef.current);
        setState(prev => ({
          ...prev,
          gameState: 'LOBBY',
          currentLevel: null,
          selectedWordIds: [],
          activeHint: null,
          hintUsedCount: 0,
          activeCategoryModal: null,
        }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [state.gameState]);

  const startLevel = useCallback(async (diff: Difficulty, levelNum: number) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ inGame: true }, '');
    }
    setState(prev => ({ 
      ...prev, 
      gameState: 'LOADING', 
      timer: 0, 
      mistakeCount: 0, 
      selectedWordIds: [],
      currentLevelNumber: levelNum,
      activeHint: null,
      hintUsedCount: 0,
      activeCategoryModal: null
    }));
    try {
      const levelData = await generateLevel(diff, levelNum);
      if (!levelData || !Array.isArray(levelData.categories) || levelData.categories.length === 0) {
        throw new Error("Invalid level data received");
      }
      setState(prev => ({ ...prev, gameState: 'PLAYING', currentLevel: levelData }));
      
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    } catch (error) {
      console.warn("Could not load dynamic level, smoothly falling back to authentic curated puzzle:", error);
      const fallbackData = getFallbackLevel(diff, levelNum);
      setState(prev => ({ ...prev, gameState: 'PLAYING', currentLevel: fallbackData }));
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
  }, []);

  const getNextLevel = (currentDiff: Difficulty, currentNum: number) => {
    if (currentNum < 10) return { diff: currentDiff, num: currentNum + 1 };
    
    if (currentDiff === Difficulty.BEGINNER) return { diff: Difficulty.INTERMEDIATE, num: 1 };
    if (currentDiff === Difficulty.INTERMEDIATE) return { diff: Difficulty.EXPERT, num: 1 };
    
    return null;
  };

  const provideHint = () => {
    if (!state.currentLevel || state.hintUsedCount >= 3) return;
    
    const unsolvedCategories = state.currentLevel.categories.filter(cat => {
      return state.currentLevel?.words.some(w => w.categoryId === cat.id && !w.isSolved);
    });

    if (unsolvedCategories.length > 0) {
      const randomCat = unsolvedCategories[Math.floor(Math.random() * unsolvedCategories.length)];
      setState(prev => ({
        ...prev,
        activeHint: `تلميح: ${randomCat.title} - ${randomCat.description}`,
        hintUsedCount: prev.hintUsedCount + 1
      }));
      audioService.play('pop');
      triggerHaptic('tap');
      
      setTimeout(() => {
        setState(prev => ({ ...prev, activeHint: null }));
      }, 8000);
    }
  };

  const toggleWordSelection = (wordId: string) => {
    triggerHaptic('tap');
    if (state.selectedWordIds.includes(wordId)) {
      audioService.play('pop');
      setState(prev => ({ ...prev, selectedWordIds: prev.selectedWordIds.filter(id => id !== wordId) }));
    } else {
      if (state.selectedWordIds.length < 4) {
        audioService.play('pop');
        setState(prev => ({ ...prev, selectedWordIds: [...prev.selectedWordIds, wordId] }));
      }
    }
  };

  useEffect(() => {
    if (state.selectedWordIds.length === 4 && state.currentLevel) {
      const words = state.currentLevel.words.filter(w => state.selectedWordIds.includes(w.id));
      const firstCatId = words[0].categoryId;
      const isMatch = words.every(w => w.categoryId === firstCatId);

      if (isMatch) {
        audioService.play('correct');
        triggerHaptic('success');
        setIsSuccessGroup(true);
        setTimeout(() => {
          setIsSuccessGroup(false);
          setState(prev => {
            const newWords = prev.currentLevel!.words.map(w => 
              state.selectedWordIds.includes(w.id) ? { ...w, isSolved: true } : w
            );
            const allSolved = newWords.every(w => w.isSolved);
            
            if (allSolved && timerRef.current) clearInterval(timerRef.current);

            return {
              ...prev,
              currentLevel: { ...prev.currentLevel!, words: newWords },
              selectedWordIds: [],
              activeHint: null, 
              gameState: allSolved ? 'COMPLETED' : 'PLAYING'
            };
          });
        }, 450);
      } else {
        audioService.play('wrong');
        triggerHaptic('error');
        setIsWrongGroup(true);
        setState(prev => ({ ...prev, mistakeCount: prev.mistakeCount + 1 }));
        setTimeout(() => {
          setIsWrongGroup(false);
          setState(prev => ({ ...prev, selectedWordIds: [] }));
        }, 1000);
      }
    }
  }, [state.selectedWordIds, state.currentLevel]);

  useEffect(() => {
    if (state.gameState === 'COMPLETED' && state.currentLevel) {
      audioService.play('win');
      triggerHaptic('win');
    }
  }, [state.gameState, state.currentLevel]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const shareResult = async () => {
    const text = `أنهيت اللغز ${state.currentLevelNumber} من ١٠ في لعبة رَوابِط خلال ${formatTime(state.timer)}! جربها الآن.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'رَوابِط', text: text, url: window.location.href });
      } catch (e) { console.error(e); }
    } else {
      navigator.clipboard.writeText(text);
      alert('تم نسخ النتيجة للمشاركة!');
    }
  };

  if (!state.user) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50/60 via-slate-50 to-sky-100/40 relative overflow-hidden">
        <ArabicParticleBackground />
        <OfflineNotification />
        <div className="bg-white/95 backdrop-blur-xs p-8 pt-6 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border-b-[8px] border-sky-100 flex flex-col gap-5 relative z-10">
          <div className="flex flex-col items-center">
            <img 
              src="/logo.png" 
              alt="شعار لعبة رَوابِط الرسمي" 
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-[1.75rem] shadow-xl border-2 border-sky-200/60 transition-transform hover:scale-105" 
              referrerPolicy="no-referrer"
            />
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(usernameInput);
            }}
            className="space-y-4"
          >
            <input 
              type="text" 
              placeholder="اسم المستخدم"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              autoFocus
              className="w-full px-6 py-4 rounded-2xl border-2 border-sky-100 focus:border-sky-500 outline-none text-lg text-center bg-sky-50/40 transition-all placeholder:text-slate-300"
            />
            <Button type="submit" fullWidth className="py-4 text-xl">ابدأ اللعب</Button>
          </form>
        </div>
      </div>
    );
  }

  const isLobby = state.gameState === 'LOBBY';
  const isPlaying = state.gameState === 'PLAYING';
  const isLoading = state.gameState === 'LOADING';
  const isCompleted = state.gameState === 'COMPLETED';

  return (
    <div className="h-[100dvh] flex flex-col bg-sky-50/25 overflow-hidden safe-paddings relative">
      <ArabicParticleBackground />
      <OfflineNotification />
      <header className="bg-white/90 backdrop-blur-md shadow-xs z-20 px-4 py-3 sm:px-8 flex justify-between items-center border-b border-sky-100 flex-shrink-0 relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <img 
              src="/pwa-192x192.png" 
              alt="أيقونة رَوابِط" 
              className="w-8 h-8 rounded-xl shadow-xs border border-sky-100 object-contain" 
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-black text-sky-600 leading-none">رَوابِط</h1>
            {state.currentLevel && (isPlaying || isCompleted) && (
              <span className="text-[11px] bg-sky-50 text-sky-800 font-black px-2.5 py-0.5 rounded-full border border-sky-200">
                {state.currentLevel.difficulty === Difficulty.BEGINNER ? 'الأشبال' : state.currentLevel.difficulty === Difficulty.INTERMEDIATE ? 'الفرسان' : 'العباقرة'} • لغز {state.currentLevelNumber} من ١٠
              </span>
            )}
          </div>
          <button 
            type="button"
            onClick={handleGoToUsernameScreen}
            className="text-[10px] text-slate-400 hover:text-sky-600 font-bold leading-none mt-1 text-right transition-colors cursor-pointer"
            title="انقر لتغيير اسم المستخدم"
          >
            المستخدم: {state.user.username}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="bg-sky-50 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-sky-200/80 shadow-inner">
              <span className="text-base font-black text-sky-700 font-mono">{formatTime(state.timer)}</span>
            </div>
          )}
          
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-xl transition-colors ${state.isMuted ? 'text-slate-400 bg-slate-100' : 'text-sky-600 bg-sky-50 hover:bg-sky-100'}`}
            title={state.isMuted ? "تشغيل الصوت" : "كتم الصوت"}
          >
             {state.isMuted ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
               </svg>
             )}
          </button>

          {isLobby ? (
            <button 
              type="button"
              className="p-2 rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700 transition-colors shadow-sm"
              onClick={handleGoToUsernameScreen}
              title="الصفحة الرئيسية (تسجيل الدخول / تغيير اسم المستخدم)"
              aria-label="الصفحة الرئيسية"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          ) : (
            <button 
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              onClick={() => setState(prev => ({ ...prev, gameState: 'LOBBY', currentLevel: null }))}
              title="العودة لاختيار التحدي"
              aria-label="العودة للقائمة"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto flex flex-col overflow-hidden relative z-10">
        {isLobby && (
          <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto no-scrollbar">
            <div 
              className="bg-white p-4 rounded-3xl shadow-sm border border-sky-100 cursor-pointer transition-all active:scale-98"
              onClick={() => setIsGuideOpen(!isGuideOpen)}
            >
              <div className="flex items-center justify-between text-sky-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <h3 className="font-black text-base">دليل اللعب السريع</h3>
                </div>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`grid transition-all duration-300 ${isGuideOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden space-y-3">
                  {[
                    { n: '١', t: 'اربط ٤ كلمات يجمعها رابط دلالي أو لغوي واحد.' },
                    { n: '٢', t: 'يتكون كل لغز من ٤ مجموعات متجانسة.' },
                    { n: '٣', t: 'يحتوي كل مستوى على ١٠ ألغاز متدرجة.' }
                  ].map(item => (
                    <div key={item.n} className="flex gap-3 items-center text-sm text-slate-600 bg-sky-50/40 p-2.5 rounded-xl border border-sky-100/60">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-black text-xs shrink-0">{item.n}</span>
                      <p className="font-medium">{item.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pb-8">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-black text-slate-800">اختر المستوى</h2>
                <span className="text-xs font-bold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-full border border-sky-200">
                  ١٠ ألغاز متتالية
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(diff => {
                  const difficultyEnum = Difficulty[diff];
                  const levelDetails = {
                    BEGINNER: {
                      title: 'مستوى الأشبال',
                      desc: 'سهل وواضح • مفردات يومية مألوفة',
                      icon: '🌱',
                      tag: 'سهل',
                      tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      hoverBorder: 'hover:border-emerald-300'
                    },
                    INTERMEDIATE: {
                      title: 'مستوى الفرسان',
                      desc: 'تفكير منطقي • روابط ذكية وتنوع دلالي',
                      icon: '⚡',
                      tag: 'متوسط',
                      tagClass: 'bg-sky-50 text-sky-700 border-sky-200',
                      hoverBorder: 'hover:border-sky-300'
                    },
                    EXPERT: {
                      title: 'مستوى العباقرة',
                      desc: 'بلاغة وعمق • روائع الأدب ولغة الضاد',
                      icon: '👑',
                      tag: 'متقدم',
                      tagClass: 'bg-orange-50 text-orange-700 border-orange-200',
                      hoverBorder: 'hover:border-orange-300'
                    }
                  }[difficultyEnum];

                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => startLevel(difficultyEnum, 1)}
                      className={`w-full bg-white p-5 rounded-[2rem] shadow-sm border border-sky-100/90 ${levelDetails.hoverBorder} hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer text-right`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-sky-50/90 group-hover:bg-sky-100/90 rounded-2xl flex items-center justify-center text-3xl border border-sky-100 shrink-0 transition-colors shadow-xs">
                          {levelDetails.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-slate-800 group-hover:text-sky-600 transition-colors">
                              {levelDetails.title}
                            </h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${levelDetails.tagClass}`}>
                              {levelDetails.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-bold">
                            {levelDetails.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pr-2 shrink-0">
                        <span className="hidden sm:inline text-xs font-black text-sky-600 group-hover:-translate-x-1 transition-transform">
                          ابدأ المستوى
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 group-hover:bg-sky-600 text-sky-700 group-hover:text-white flex items-center justify-center font-black transition-all shadow-xs text-base">
                          ←
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-8 border-sky-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-sky-600 animate-pulse mb-2">جاري التفكير...</h2>
            <p className="text-slate-400 font-bold max-w-[200px]">الذكاء الاصطناعي يصيغ لك لغزاً فريداً الآن</p>
          </div>
        )}

        {isPlaying && state.currentLevel && (
          <div className="flex-grow flex flex-col p-3 sm:p-4 gap-3 overflow-hidden">
            {/* Solved Categories Banners */}
            <div className="flex flex-col gap-1 sm:gap-1.5 shrink-0 max-h-[35%] overflow-y-auto no-scrollbar">
              <AnimatePresence>
                {state.currentLevel.categories.map(cat => {
                  const catWords = state.currentLevel?.words.filter(w => w.categoryId === cat.id);
                  const isSolved = catWords?.every(w => w.isSolved);
                  if (!isSolved) return null;
                  return (
                    <motion.div 
                      key={cat.id} 
                      layout
                      initial={{ opacity: 0, y: -12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                      onClick={() => setState(prev => ({ ...prev, activeCategoryModal: cat }))}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl text-white shadow-sm border-b-2 shrink-0 select-none cursor-pointer transition-all hover:brightness-105 active:scale-[0.99] group"
                      style={{ backgroundColor: cat.color, borderBottomColor: 'rgba(0,0,0,0.25)' }}
                      title="انقر لعرض معاني وفوائد كلمات هذه المجموعة"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-base sm:text-lg">{cat.icon}</span>
                        <span className="text-xs sm:text-sm font-black whitespace-nowrap">{cat.title}</span>
                        <span className="text-[10px] bg-white/20 group-hover:bg-white/30 text-white font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-white/25 transition-colors">
                          <span>💡</span>
                          <span className="hidden sm:inline">معلومات</span>
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-white/90 font-bold truncate max-w-[50%] sm:max-w-[58%] text-left">
                        {catWords?.map(w => w.text).join(' • ')}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Hint Box */}
            <div className={`transition-all duration-300 overflow-hidden shrink-0 ${state.activeHint ? 'max-h-20 mb-2' : 'max-h-0'}`}>
              <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl text-center font-bold text-xs border border-emerald-200 shadow-sm">
                💡 {state.activeHint}
              </div>
            </div>

            {/* Main Word Grid */}
            {(() => {
              const unsolvedWords = state.currentLevel.words.filter(w => !w.isSolved);

              return (
                <div className="flex-grow flex flex-col justify-center min-h-0 py-1 overflow-y-auto no-scrollbar">
                  <motion.div 
                    layout
                    transition={{ layout: { type: "spring", stiffness: 320, damping: 28 } }}
                    className="grid grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full my-auto max-w-lg mx-auto"
                  >
                    <AnimatePresence mode="popLayout">
                      {unsolvedWords.map((word) => {
                        const category = state.currentLevel?.categories.find(c => c.id === word.categoryId);
                        const shouldShowHint = state.currentLevel?.difficulty === Difficulty.BEGINNER;
                        return (
                          <motion.div 
                            key={word.id}
                            layout
                            layoutId={word.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.22 } }}
                            transition={{
                              layout: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
                              opacity: { duration: 0.2 }
                            }}
                            className="w-full flex"
                          >
                            <WordCard
                              word={word}
                              category={shouldShowHint ? category : undefined}
                              isSelected={state.selectedWordIds.includes(word.id)}
                              isWrong={isWrongGroup && state.selectedWordIds.includes(word.id)}
                              isSuccess={isSuccessGroup && state.selectedWordIds.includes(word.id)}
                              onClick={() => toggleWordSelection(word.id)}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })()}

            {/* Game Controls Footer */}
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-3xl border border-white/50 flex flex-col items-center gap-3 shrink-0 shadow-lg">
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  الأخطاء: {state.mistakeCount}
                </div>
                <div className="text-[11px] font-black text-sky-700">
                   اخترت {state.selectedWordIds.length} من ٤
                </div>
              </div>
              
              <div className="flex gap-2 w-full">
                <button 
                  onClick={provideHint}
                  disabled={!!state.activeHint || state.hintUsedCount >= 3}
                  className="flex-1 bg-emerald-50 text-emerald-700 py-3 rounded-2xl font-black text-xs border-b-2 border-emerald-200 active:translate-y-0.5 active:border-b-0 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  💡 مساعدة ({3 - state.hintUsedCount})
                </button>
                <button 
                  onClick={() => setState(prev => ({...prev, selectedWordIds: []}))}
                  disabled={state.selectedWordIds.length === 0}
                  className="flex-1 bg-sky-50 text-sky-700 py-3 rounded-2xl font-black text-xs border-b-2 border-sky-200 active:translate-y-0.5 active:border-b-0 transition-all disabled:opacity-30"
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="flex-grow flex flex-col p-6 items-center justify-center text-center">
            <Confetti />
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-b-[12px] border-sky-100 w-full animate-success-reveal relative z-10">
              <div className="text-7xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-sky-600 mb-2">رائع جداً!</h2>
              <p className="text-slate-500 font-bold mb-8 italic">"خير الكلام ما قلّ ودلّ"</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-sky-50 p-4 rounded-3xl border border-sky-100">
                  <div className="text-[10px] text-sky-600 font-black mb-1">الزمن المستغرق</div>
                  <div className="text-2xl font-black text-sky-900 font-mono">{formatTime(state.timer)}</div>
                </div>
                <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100">
                  <div className="text-[10px] text-rose-600 font-black mb-1">المحاولات</div>
                  <div className="text-2xl font-black text-rose-900 font-mono">{state.mistakeCount}</div>
                </div>
              </div>

              {/* Review Solved Categories with Details */}
              {state.currentLevel && (
                <div className="mb-6 text-right w-full">
                  <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1.5 justify-start">
                    <span>💡</span>
                    <span>انقر على أي مجموعة لقراءة معانيها وفوائدها:</span>
                  </p>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto no-scrollbar">
                    {state.currentLevel.categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, activeCategoryModal: cat }))}
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl text-white shadow-xs border-b-2 transition-all hover:brightness-105 active:scale-[0.99] text-right cursor-pointer"
                        style={{ backgroundColor: cat.color, borderBottomColor: 'rgba(0,0,0,0.25)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          <span className="text-xs sm:text-sm font-black">{cat.title}</span>
                        </div>
                        <span className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full font-bold">
                          استكشف الفوائد ✨
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {getNextLevel(state.currentLevel!.difficulty, state.currentLevelNumber) ? (
                  <Button 
                    fullWidth 
                    className="py-4 font-black bg-gradient-to-l from-sky-700 via-sky-600 to-sky-700 hover:from-sky-800 hover:to-sky-700 text-white shadow-xl border-b-4 border-sky-900"
                    style={{ color: '#ffffff' }}
                    onClick={() => {
                      const next = getNextLevel(state.currentLevel!.difficulty, state.currentLevelNumber);
                      if (next) startLevel(next.diff, next.num);
                    }}
                  >
                    <span className="text-white font-black text-lg sm:text-xl tracking-wide flex items-center justify-center gap-2 drop-shadow-sm" style={{ color: '#ffffff' }}>
                      <span>
                        {state.currentLevelNumber < 10 
                          ? `الانتقال إلى اللغز التالي (${state.currentLevelNumber + 1} من ١٠)` 
                          : 'الانتقال إلى المستوى التالي'}
                      </span>
                      <span className="text-lg font-bold bg-white/20 w-7 h-7 rounded-lg flex items-center justify-center">
                        ←
                      </span>
                    </span>
                  </Button>
                ) : (
                  <Button variant="success" fullWidth className="py-4 text-lg" onClick={() => setState(prev => ({...prev, gameState: 'LOBBY'}))}>
                    🎉 أحسنت صنعاً! أنهيت جميع ألغاز اللعبة
                  </Button>
                )}
                <button 
                  onClick={shareResult}
                  className="text-sky-600 hover:text-sky-500 font-black text-sm hover:underline py-2 cursor-pointer"
                >
                  تحدّ أصدقاءك بالنتيجة
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Category Facts & Definitions Modal */}
      {state.activeCategoryModal && (
        <CategoryModal
          category={state.activeCategoryModal}
          words={state.currentLevel?.words}
          onClose={() => setState(prev => ({ ...prev, activeCategoryModal: null }))}
        />
      )}

      {isLobby && (
        <footer className="p-4 text-center border-t border-sky-100/50 flex-shrink-0">
          <p className="text-[10px] text-slate-400 font-bold tracking-tight">
            رَوابِط © ٢٠٢٤ • صُنِع بشغف للغة الضاد
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
