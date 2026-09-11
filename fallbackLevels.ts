import { Difficulty, GameLevel } from "./types";

interface RawLevelData {
  categories: {
    id: string;
    title: string;
    icon: string;
    color: string;
    description: string;
    words: string[];
  }[];
}

export const FALLBACK_DATABASE: Record<Difficulty, Record<number, RawLevelData>> = {
  [Difficulty.BEGINNER]: {
    1: {
      categories: [
        {
          id: "fruits",
          title: "فواكه لذيذة",
          icon: "🍉",
          color: "#EF4444",
          description: "ثمار طبيعية غنية بالفيتامينات",
          words: ["بطيخ", "عنب", "تين", "تفاح"]
        },
        {
          id: "pets",
          title: "حيوانات أليفة",
          icon: "🐱",
          color: "#F59E0B",
          description: "كائنات لطيفة تعيش بالقرب من الإنسان",
          words: ["قطة", "كلب", "أرنب", "حصان"]
        },
        {
          id: "colors",
          title: "ألوان أساسية",
          icon: "🎨",
          color: "#3B82F6",
          description: "درجات لونية مميزة في الطبيعة",
          words: ["أحمر", "أزرق", "أصفر", "أخضر"]
        },
        {
          id: "clothes",
          title: "ملابس شتوية",
          icon: "🧣",
          color: "#10B981",
          description: "أزياء نرتديها لتدفئة الجسد في البرد",
          words: ["معطف", "قبعة", "وشاح", "قفاز"]
        }
      ]
    },
    2: {
      categories: [
        {
          id: "veggies",
          title: "خضروات ورقية",
          icon: "🥬",
          color: "#10B981",
          description: "نباتات خضراء مفيدة للصحة",
          words: ["خس", "سبانخ", "جرجير", "بقدونس"]
        },
        {
          id: "birds",
          title: "طيور مغردة",
          icon: "🐦",
          color: "#3B82F6",
          description: "عصافير تتميز بأصواتها العذبة",
          words: ["بلبل", "حسون", "كناري", "عندليب"]
        },
        {
          id: "transport",
          title: "وسائل مواصلات",
          icon: "🚆",
          color: "#6366F1",
          description: "مركبات تنقل الناس والبضائع",
          words: ["قطار", "حافلة", "طائرة", "سفينة"]
        },
        {
          id: "school",
          title: "أدوات مدرسية",
          icon: "✏️",
          color: "#F59E0B",
          description: "مستلزمات الدراسة والكتابة",
          words: ["قلم", "مسطرة", "ممحاة", "دفتر"]
        },
        {
          id: "family",
          title: "أفراد الأسرة",
          icon: "👨‍👩‍👧",
          color: "#EC4899",
          description: "أعضاء البيت والعائلة الكريمة",
          words: ["والد", "والدة", "أخ", "أخت"]
        }
      ]
    },
    3: {
      categories: [
        {
          id: "crafts",
          title: "مهن وحرف",
          icon: "🔨",
          color: "#F97316",
          description: "أعمال يدوية نافعة للمجتمع",
          words: ["نجار", "حداد", "خياط", "فلاح"]
        },
        {
          id: "seasons",
          title: "فصول السنة",
          icon: "🍂",
          color: "#EAB308",
          description: "أوقات مناخية تدور مدار العام",
          words: ["ربيع", "صيف", "خريف", "شتاء"]
        },
        {
          id: "shapes",
          title: "أشكال هندسية",
          icon: "📐",
          color: "#8B5CF6",
          description: "رسوم هندسية منتظمة الأضلاع",
          words: ["مربع", "مثلث", "دائرة", "مستطيل"]
        },
        {
          id: "senses",
          title: "حواس الإنسان",
          icon: "👁️",
          color: "#06B6D4",
          description: "منافذ الإدراك والشعور",
          words: ["بصر", "سمع", "لمس", "تذوق"]
        },
        {
          id: "drinks",
          title: "مشروبات دافئة",
          icon: "☕",
          color: "#78350F",
          description: "سوائل لذيذة تبعث الدفء",
          words: ["شاي", "قهوة", "قرفة", "ينسون"]
        },
        {
          id: "spices",
          title: "توابل وبهارات",
          icon: "🧂",
          color: "#D97706",
          description: "نكهات أصيلة تضاف إلى الطعام",
          words: ["زعفران", "هيل", "فلفل", "كمون"]
        }
      ]
    }
  },
  [Difficulty.INTERMEDIATE]: {
    1: {
      categories: [
        {
          id: "emotions",
          title: "مشاعر وجدانية",
          icon: "💭",
          color: "#EC4899",
          description: "أحاسيس تفيض في النفس البشرية",
          words: ["شوق", "حنين", "سرور", "غبطة"]
        },
        {
          id: "astronomy",
          title: "ظواهر فلكية",
          icon: "🌌",
          color: "#6366F1",
          description: "أحداث سماوية في الفضاء الرحب",
          words: ["كسوف", "خسوف", "نيزك", "مذنب"]
        },
        {
          id: "geography",
          title: "تضاريس جغرافية",
          icon: "🏔️",
          color: "#0D9488",
          description: "معالم طبيعية تشكل سطح الأرض",
          words: ["هضبة", "وادٍ", "مضيق", "خليج"]
        },
        {
          id: "elements",
          title: "العناصر الطبيعية الأربعة",
          icon: "🌪️",
          color: "#EA580C",
          description: "أركان الطبيعة الكلاسيكية",
          words: ["نار", "ماء", "هواء", "تراب"]
        }
      ]
    },
    2: {
      categories: [
        {
          id: "construction",
          title: "أدوات التشييد",
          icon: "🏗️",
          color: "#D97706",
          description: "آلات ومعدات يستعين بها البنّاء",
          words: ["مطرقة", "إزميل", "رافعة", "ميزان"]
        },
        {
          id: "time_words",
          title: "مفردات زمانية عربية",
          icon: "⏳",
          color: "#8B5CF6",
          description: "ألفاظ تدل على أوقات وآماد",
          words: ["برهة", "دهر", "غسق", "سحر"]
        },
        {
          id: "fine_arts",
          title: "فنون تشكيلية وبصرية",
          icon: "🎨",
          color: "#0284C7",
          description: "إبداعات تنبض بالجمال والذوق",
          words: ["رسم", "نحت", "خزف", "خط"]
        },
        {
          id: "energy",
          title: "طاقات متجددة",
          icon: "⚡",
          color: "#16A34A",
          description: "مصادر طاقة نظيفة ومستدامة",
          words: ["شمس", "رياح", "أمواج", "حرارة"]
        },
        {
          id: "vessels",
          title: "أوانٍ تراثية",
          icon: "🏺",
          color: "#B45309",
          description: "أوعية شائعة في الموروث العربي",
          words: ["إبريق", "فنجان", "جرّة", "قصعة"]
        }
      ]
    },
    3: {
      categories: [
        {
          id: "weather_phenomena",
          title: "مظاهر جوية ومناخية",
          icon: "⛈️",
          color: "#0284C7",
          description: "حالات وتقلبات تحدث في الغلاف الجوي",
          words: ["ضباب", "صقيع", "ندى", "رعد"]
        },
        {
          id: "internal_organs",
          title: "أعضاء حيوية باطنية",
          icon: "🫀",
          color: "#DC2626",
          description: "أجهزة تحفظ حياة الكائن الحي",
          words: ["قلب", "كبد", "رئة", "معدة"]
        },
        {
          id: "finance",
          title: "معاملات مالية ومصرفية",
          icon: "🪙",
          color: "#CA8A04",
          description: "عقود وصكوك تداول الأموال",
          words: ["صك", "قرض", "وديعة", "رهن"]
        },
        {
          id: "speech_verbs",
          title: "أفعال البيان والحديث",
          icon: "🗣️",
          color: "#9333EA",
          description: "صيغ عربية للتعبير عن درجات القول",
          words: ["همس", "هتف", "أنشد", "خطب"]
        },
        {
          id: "sciences",
          title: "حقول علمية دقيقة",
          icon: "🔬",
          color: "#059669",
          description: "معارف تجريبية تبحث في أسرار الكون",
          words: ["أحياء", "كيمياء", "فلك", "جيولوجيا"]
        },
        {
          id: "textiles",
          title: "خامات وأقمشة",
          icon: "🧵",
          color: "#DB2777",
          description: "ألياف تستخدم في نسج الملابس",
          words: ["حرير", "صوف", "كتان", "قطن"]
        }
      ]
    }
  },
  [Difficulty.EXPERT]: {
    1: {
      categories: [
        {
          id: "sword_names",
          title: "من أسماء السيف",
          icon: "🗡️",
          color: "#DC2626",
          description: "ألقاب السلاح القاطع في لغة العرب",
          words: ["حسام", "مهند", "صمصام", "بتار"]
        },
        {
          id: "lion_names",
          title: "من أسماء ملك الغاب",
          icon: "🦁",
          color: "#D97706",
          description: "نعوت الأسد المتواترة في المعاجم",
          words: ["غضنفر", "قسورة", "ليث", "ضرغام"]
        },
        {
          id: "antonyms_rare",
          title: "أضداد لغوية فريدة",
          icon: "📜",
          color: "#7C3AED",
          description: "كلمات تفيد المعنى وضده بحسب السياق",
          words: ["جلل", "بسل", "جون", "رهاء"]
        },
        {
          id: "horse_traits",
          title: "أوصاف الخيل الأصيلة",
          icon: "🐎",
          color: "#92400E",
          description: "مفردات الفروسية والسبق والصفات العالية",
          words: ["طِرف", "سابح", "جواد", "كميت"]
        }
      ]
    },
    2: {
      categories: [
        {
          id: "plurals_rare",
          title: "جموع قلة وتكسير معجمية",
          icon: "📚",
          color: "#4F46E5",
          description: "صيغ جموع فصيحة على أوزان عربية محكمة",
          words: ["أفئدة", "صبية", "أسلحة", "غلمة"]
        },
        {
          id: "poetry_meters",
          title: "بحور الشعر الخليلية",
          icon: "🎼",
          color: "#0891B2",
          description: "أوزان وموازين القريض العربي",
          words: ["طويل", "بسيط", "كامل", "وافر"]
        },
        {
          id: "moon_mansions",
          title: "منازل وأنواء القمر",
          icon: "🌙",
          color: "#7E22CE",
          description: "محطات فلكية رصدها العرب قديماً",
          words: ["ثريا", "دبران", "سماك", "عواء"]
        },
        {
          id: "bravery",
          title: "نعوت الشجاعة والبسالة",
          icon: "🛡️",
          color: "#B91C1C",
          description: "أوصاف الصناديد في ميادين الإقدام",
          words: ["مقدام", "صنديد", "باسل", "هصور"]
        },
        {
          id: "rhetoric",
          title: "محسنات بديعية وبيانية",
          icon: "✒️",
          color: "#047857",
          description: "فنون تزيين اللفظ وحسن دلالة المعنى",
          words: ["جناس", "طباق", "تورية", "سجع"]
        }
      ]
    },
    3: {
      categories: [
        {
          id: "rain_grades",
          title: "مراتب المطر في المعجم",
          icon: "🌧️",
          color: "#0284C7",
          description: "درجات الغيث من الرذاذ إلى السيل",
          words: ["رذاذ", "وابل", "طش", "ديمة"]
        },
        {
          id: "night_hours",
          title: "ساعات وظلمات الليل",
          icon: "🌌",
          color: "#312E81",
          description: "تقسيمات أوقات السواد في اللسان العربي",
          words: ["شفق", "غسق", "عتمة", "سدفة"]
        },
        {
          id: "calligraphy_scripts",
          title: "أقلام الخط العربي الأصيل",
          icon: "🖋️",
          color: "#78350F",
          description: "أنواع الرسم والحرف العربي الشريف",
          words: ["كوفي", "ثلث", "ديواني", "رقعة"]
        },
        {
          id: "honey_words",
          title: "من مسميات الشهد والرحيق",
          icon: "🍯",
          color: "#EAB308",
          description: "أسماء العسل المصفى في لغة الضاد",
          words: ["شهد", "شري", "ماذي", "سلسبيل"]
        },
        {
          id: "grammarians",
          title: "أعلام النحو واللغة",
          icon: "👳‍♂️",
          color: "#15803D",
          description: "علماء أصلوا قواعد اللسان العربي",
          words: ["سيبويه", "الفراهيدي", "الكسائي", "الفراء"]
        },
        {
          id: "cloud_names",
          title: "أوصاف السحاب والمزن",
          icon: "☁️",
          color: "#475569",
          description: "أسماء الغمام الحامل للخير والماء",
          words: ["سحاب", "مزن", "ركام", "غمام"]
        }
      ]
    }
  }
};

export function getFallbackLevel(difficulty: Difficulty, levelNumber: number): GameLevel {
  const diffGroup = FALLBACK_DATABASE[difficulty] || FALLBACK_DATABASE[Difficulty.BEGINNER];
  const validLevelNum = (levelNumber >= 1 && levelNumber <= 3) ? levelNumber : 1;
  const rawData = diffGroup[validLevelNum] || diffGroup[1];

  const categories = rawData.categories.map((c) => ({
    id: c.id,
    title: c.title,
    icon: c.icon,
    color: c.color,
    description: c.description
  }));

  const words = rawData.categories.flatMap((c) =>
    c.words.map((w, idx) => ({
      id: `${c.id}-${idx}`,
      text: w,
      categoryId: c.id,
      isSolved: false
    }))
  );

  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  return {
    difficulty,
    levelNumber: validLevelNum,
    categories,
    words: shuffledWords
  };
}
