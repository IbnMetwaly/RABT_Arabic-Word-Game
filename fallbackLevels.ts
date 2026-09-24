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
        }
      ]
    },
    4: {
      categories: [
        {
          id: "citrus",
          title: "حمضيات منعشة",
          icon: "🍊",
          color: "#F97316",
          description: "ثمار حمضية منعشة وغنية بفيتامين ج",
          words: ["برتقال", "ليمون", "يوسفي", "جريب‌فروت"]
        },
        {
          id: "farm_animals",
          title: "حيوانات المزرعة",
          icon: "🐑",
          color: "#10B981",
          description: "كائنات نافعة يربيها الإنسان في الحقل",
          words: ["بقرة", "خروف", "ماعز", "حمار"]
        },
        {
          id: "home_furniture",
          title: "أثاث البيت",
          icon: "🛋️",
          color: "#6366F1",
          description: "مفروشات ومقتنيات ترتيب المنزل",
          words: ["سرير", "أريكة", "طاولة", "خزانة"]
        },
        {
          id: "face_parts",
          title: "أجزاء الوجه",
          icon: "🧒",
          color: "#EC4899",
          description: "ملامح رئيسية في وجه الإنسان",
          words: ["عين", "أنف", "فم", "أذن"]
        }
      ]
    },
    5: {
      categories: [
        {
          id: "fragrant_flowers",
          title: "أزهار عطرة",
          icon: "🌸",
          color: "#EC4899",
          description: "زهور جميلة تفوح بروائح زكية",
          words: ["ياسمين", "ورد", "فل", "نرجس"]
        },
        {
          id: "poultry",
          title: "طيور داجنة",
          icon: "🐔",
          color: "#F59E0B",
          description: "طيور أليفة تربى في المنازل والمزارع",
          words: ["دجاجة", "بطة", "إوزة", "ديك"]
        },
        {
          id: "kitchen_utensils",
          title: "أدوات المائدة",
          icon: "🥄",
          color: "#3B82F6",
          description: "مستلزمات تناول وتجهيز الطعام",
          words: ["ملعقة", "شوكة", "سكين", "صحن"]
        },
        {
          id: "kids_toys",
          title: "ألعاب الأطفال",
          icon: "🧸",
          color: "#8B5CF6",
          description: "ألعاب تبهج الصغار وتملأ أوقاتهم مرحاً",
          words: ["دمية", "كرة", "طائرة", "أرجوحة"]
        }
      ]
    },
    6: {
      categories: [
        {
          id: "daily_times",
          title: "أوقات اليوم",
          icon: "⏰",
          color: "#F59E0B",
          description: "محطات زمنية تمر خلال اليوم الواحد",
          words: ["فجر", "ظهر", "عصر", "مغرب"]
        },
        {
          id: "nuts",
          title: "مكسرات لذيذة",
          icon: "🥜",
          color: "#78350F",
          description: "ثمار جافة ومغذية تمنح الطاقة",
          words: ["لوز", "فستق", "جوز", "بندق"]
        },
        {
          id: "summer_wear",
          title: "ملابس صيفية",
          icon: "👕",
          color: "#06B6D4",
          description: "أزياء خفيفة ومناسبة للطقس الدافئ",
          words: ["قميص", "تنورة", "صندل", "قبعة"]
        },
        {
          id: "water_features",
          title: "مسطحات مائية",
          icon: "🌊",
          color: "#3B82F6",
          description: "معالم طبيعية للماء العذب والمالح",
          words: ["بحر", "نهر", "بحيرة", "شلال"]
        }
      ]
    },
    7: {
      categories: [
        {
          id: "root_veggies",
          title: "خضار جذرية",
          icon: "🥕",
          color: "#EA580C",
          description: "خضروات تنمو تحت سطح التربة",
          words: ["جزر", "بطاطس", "لفت", "فجل"]
        },
        {
          id: "wild_animals",
          title: "حيوانات الغابة",
          icon: "🦒",
          color: "#D97706",
          description: "مخلوقات برية تعيش في الطبيعة والبراري",
          words: ["زرافة", "فيل", "قرد", "غزال"]
        },
        {
          id: "house_rooms",
          title: "غرف ومرافق البيت",
          icon: "🏡",
          color: "#10B981",
          description: "أقسام وأجنحة المنزل المتنوعة",
          words: ["مطبخ", "شرفة", "صالة", "حمام"]
        },
        {
          id: "sports_moves",
          title: "أنشطة رياضية",
          icon: "🏃",
          color: "#6366F1",
          description: "حركات بدنية تنشط الجسد وتقوي العضلات",
          words: ["جري", "قفز", "سباحة", "مشي"]
        }
      ]
    },
    8: {
      categories: [
        {
          id: "footwear",
          title: "أحذية ومطايا القدم",
          icon: "👟",
          color: "#475569",
          description: "ملبوسات لحماية القدم أثناء السير",
          words: ["حذاء", "خف", "جزمة", "قبقاب"]
        },
        {
          id: "art_tools",
          title: "أدوات الرسم",
          icon: "🖌️",
          color: "#8B5CF6",
          description: "مستلزمات التلوين والتعبير الفني",
          words: ["ريشة", "لوحة", "ألوان", "كراسة"]
        },
        {
          id: "insects_familiar",
          title: "حشرات مألوفة",
          icon: "🐝",
          color: "#EAB308",
          description: "كائنات صغيرة شائعة في بيئتنا",
          words: ["نحلة", "فراشة", "نملة", "دعسوقة"]
        },
        {
          id: "appliances",
          title: "أجهزة كهربائية منزلية",
          icon: "🔌",
          color: "#0D9488",
          description: "آلات تسهل الأعمال اليومية في البيت",
          words: ["ثلاجة", "غسالة", "مروحة", "مكنسة"]
        }
      ]
    },
    9: {
      categories: [
        {
          id: "dairy_products",
          title: "مشتقات الحليب",
          icon: "🧀",
          color: "#F59E0B",
          description: "منتجات مغذية تصنع من لبن الماشية",
          words: ["حليب", "جبن", "زبدة", "قشطة"]
        },
        {
          id: "hygiene_tools",
          title: "أدوات العناية الشخصية",
          icon: "🧼",
          color: "#06B6D4",
          description: "أغراض تساعد في الحفاظ على النظافة",
          words: ["صابون", "مشط", "منشفة", "فرشاة"]
        },
        {
          id: "celestial_bodies",
          title: "أجرام في السماء",
          icon: "✨",
          color: "#4F46E5",
          description: "معالم نراها في سماء النهار والليل",
          words: ["شمس", "قمر", "نجم", "أرض"]
        },
        {
          id: "feelings_innocent",
          title: "مشاعر بهيجة",
          icon: "😊",
          color: "#EC4899",
          description: "حالات من الفرح والسرور تملأ القلب",
          words: ["فرح", "ضحك", "أمل", "حماس"]
        }
      ]
    },
    10: {
      categories: [
        {
          id: "baked_goods",
          title: "مخبوزات ومعجنات",
          icon: "🥖",
          color: "#D97706",
          description: "أطعمة شهية تُعجن وتُخبز في الفرن",
          words: ["خبز", "كعك", "فطيرة", "سمبوسة"]
        },
        {
          id: "precious_treasures",
          title: "حلي وأحجار زينة",
          icon: "💎",
          color: "#EAB308",
          description: "معادن وجواهر ثمينة للزينة والتجمل",
          words: ["فضة", "ذهب", "لؤلؤ", "مرجان"]
        },
        {
          id: "comm_devices",
          title: "وسائل الاتصال والإعلام",
          icon: "📻",
          color: "#6366F1",
          description: "وسائط تواصل وتبادل للأخبار والمعلومات",
          words: ["هاتف", "رسالة", "مذياع", "تلفاز"]
        },
        {
          id: "limb_parts",
          title: "أطراف الجسد",
          icon: "🖐️",
          color: "#10B981",
          description: "أعضاء الحركة والإمساك في جسم الإنسان",
          words: ["يد", "قدم", "ساق", "ذراع"]
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
        }
      ]
    },
    4: {
      categories: [
        {
          id: "intellect_traits",
          title: "صفات العقل والرجاحة",
          icon: "🧠",
          color: "#4F46E5",
          description: "سمات تدل على النباهة وحسن التقدير",
          words: ["فطنة", "حكمة", "نباهة", "دهاء"]
        },
        {
          id: "medicinal_herbs",
          title: "نباتات طبية وعشبية",
          icon: "🌿",
          color: "#10B981",
          description: "أعشاب نافعة يستطب بها في الطب التقليدي",
          words: ["مرمية", "زعتر", "بابونج", "حلبة"]
        },
        {
          id: "sea_vessels",
          title: "سفن ومراكب بحرية",
          icon: "⛵",
          color: "#0284C7",
          description: "وسائط الإبحار والتنقل فوق المياه",
          words: ["زورق", "يخت", "فلوكة", "بارجة"]
        },
        {
          id: "coastal_landforms",
          title: "تضاريس ساحلية",
          icon: "🏖️",
          color: "#D97706",
          description: "تشكلات اليابسة عند التقائها بمياه البحر",
          words: ["شاطئ", "رأس", "شبه‌جزيرة", "كثيب"]
        }
      ]
    },
    5: {
      categories: [
        {
          id: "traditional_weapons",
          title: "عتاد وأسلحة تراثية",
          icon: "🏹",
          color: "#DC2626",
          description: "أدوات النزال والدفاع في العصور القديمة",
          words: ["درع", "رمح", "قوس", "خنجر"]
        },
        {
          id: "sorrow_states",
          title: "حالات الحزن والشجن",
          icon: "💔",
          color: "#7C3AED",
          description: "مسميات درجات الأسى في اللسان العربي",
          words: ["كمد", "شجن", "لوعة", "أسف"]
        },
        {
          id: "measurement_tools",
          title: "أدوات القياس والملاحة",
          icon: "🧭",
          color: "#CA8A04",
          description: "أجهزة ضبط المقادير وتحديد الاتجاهات",
          words: ["بوصلة", "أسطرلاب", "معيار", "ساعة"]
        },
        {
          id: "atmospheric_states",
          title: "أجواء وظواهر بصرية",
          icon: "🌫️",
          color: "#475569",
          description: "مظاهر تتشكل في الأفق بتأثير الضوء والهواء",
          words: ["سحاب", "سراب", "شفق", "غمام"]
        }
      ]
    },
    6: {
      categories: [
        {
          id: "greenery_places",
          title: "بساتين وجنات خضراء",
          icon: "🌳",
          color: "#16A34A",
          description: "أماكن تكسوها الخضرة ويجري فيها الماء",
          words: ["واحة", "بستان", "روضة", "غدير"]
        },
        {
          id: "sleep_stages",
          title: "أحوال النوم واليقظة",
          icon: "💤",
          color: "#6366F1",
          description: "مراتب استراحة الجسد من النعاس إلى الغفوة",
          words: ["وسن", "كرى", "هجوع", "أرق"]
        },
        {
          id: "industrial_metals",
          title: "معادن أرضية",
          icon: "⛏️",
          color: "#78716C",
          description: "فلزات تستخرج من باطن الأرض وتطرق",
          words: ["نحاس", "حديد", "رصاص", "قصدير"]
        },
        {
          id: "heritage_arch",
          title: "معالم عمارة إسلامية",
          icon: "🕌",
          color: "#D97706",
          description: "عناصر بارزة في الهندسة المعمارية التراثية",
          words: ["مئذنة", "قبة", "رواق", "قلعة"]
        }
      ]
    },
    7: {
      categories: [
        {
          id: "human_stages",
          title: "مراحل العمر البشري",
          icon: "👤",
          color: "#EA580C",
          description: "أطوار يمر بها الإنسان منذ ولادته إلى شيخوخته",
          words: ["رضيع", "غلام", "فتى", "كهل"]
        },
        {
          id: "soil_types",
          title: "أنواع التربة والأرض",
          icon: "🪴",
          color: "#854D0E",
          description: "طبقات الأرض ورواسبها الطبيعية",
          words: ["صلصال", "رمل", "طمي", "حصى"]
        },
        {
          id: "thinking_verbs",
          title: "أفعال النظر والتأمل",
          icon: "💡",
          color: "#0891B2",
          description: "عمليات التفكير والاستنتاج العقلي",
          words: ["تأمل", "استنباط", "تمحيص", "إدراك"]
        },
        {
          id: "oriental_instruments",
          title: "آلات موسيقية شرقية",
          icon: "🪕",
          color: "#B45309",
          description: "أدوات الإيقاع والعزف في التراث العربي",
          words: ["عود", "ناي", "قانون", "ربابة"]
        }
      ]
    },
    8: {
      categories: [
        {
          id: "affection_bonds",
          title: "عواطف التآلف والود",
          icon: "🤝",
          color: "#EC4899",
          description: "روابط المحبة والإخاء بين الناس",
          words: ["ألفة", "مودة", "إخاء", "إيثار"]
        },
        {
          id: "cosmic_structures",
          title: "أجرام وتجمعات كونية",
          icon: "🪐",
          color: "#4F46E5",
          description: "تراكيب فضائية عملاقة في السماء",
          words: ["كوكب", "مجرة", "سديم", "شهاب"]
        },
        {
          id: "scholarly_professions",
          title: "مهن فكرية وقضائية",
          icon: "⚖️",
          color: "#0F766E",
          description: "وظائف قائمة على العلم والتحقيق والعدل",
          words: ["باحث", "مؤرخ", "مترجم", "قاضٍ"]
        },
        {
          id: "scribal_tools",
          title: "أدوات التدوين التراثية",
          icon: "📜",
          color: "#B45309",
          description: "مستلزمات خط الكتب والمخطوطات القديمة",
          words: ["قرطاس", "مداد", "ريشة", "محبرة"]
        }
      ]
    },
    9: {
      categories: [
        {
          id: "light_sources",
          title: "مصادر الإنارة الكلاسيكية",
          icon: "🪔",
          color: "#EAB308",
          description: "وسائل إشعال الضوء قبل اختراع الكهرباء",
          words: ["قنديل", "سراج", "مشعل", "فانوس"]
        },
        {
          id: "nature_sounds",
          title: "أصوات عناصر الطبيعة",
          icon: "🍃",
          color: "#15803D",
          description: "نغمات وأصوات تصدر عن الرياح والماء والأشجار",
          words: ["خرير", "حفيف", "هدير", "صرير"]
        },
        {
          id: "water_phases",
          title: "حالات وأشكال الماء",
          icon: "💧",
          color: "#0284C7",
          description: "التحولات الفيزيائية لعنصر الماء",
          words: ["بخار", "ثلج", "جليد", "سائل"]
        },
        {
          id: "noble_virtues",
          title: "فضائل وشمائل عربية",
          icon: "🛡️",
          color: "#B91C1C",
          description: "خلق كريم ومآثر اشتهر بها أهل البادية والحضر",
          words: ["مروءة", "شهامة", "عفة", "أمانة"]
        }
      ]
    },
    10: {
      categories: [
        {
          id: "lodgings",
          title: "منازل السفر والنزول",
          icon: "⛺",
          color: "#C2410C",
          description: "أماكن استراحة الرحالة والمسافرين",
          words: ["مخيم", "نزل", "فندق", "مضارب"]
        },
        {
          id: "mountain_passes",
          title: "ممرات ومنافذ الجبال",
          icon: "🧗",
          color: "#78716C",
          description: "مسالك وعرة بين الجبال والتلال",
          words: ["فج", "شعب", "نقب", "عقبة"]
        },
        {
          id: "perseverance",
          title: "نعوت الصبر والثبات",
          icon: "⚓",
          color: "#047857",
          description: "معاني الصمود وحبس النفس عند الشدائد",
          words: ["تحمل", "مصابرة", "أناة", "حلم"]
        },
        {
          id: "gem_hues",
          title: "ألوان مأخوذة من الجواهر",
          icon: "🎨",
          color: "#9333EA",
          description: "درجات لونية راقية مشتقة من الأحجار الكريمة",
          words: ["أرجوان", "فيروزي", "خمري", "زمردي"]
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
        }
      ]
    },
    4: {
      categories: [
        {
          id: "wolf_names",
          title: "من أسماء الذئب في المعجم",
          icon: "🐺",
          color: "#64748B",
          description: "ألقاب الذئب في اللسان العربي ومأثور البادية",
          words: ["أوس", "عاسل", "ذؤالة", "عملس"]
        },
        {
          id: "wind_names",
          title: "أسماء الرياح وأطباعها",
          icon: "💨",
          color: "#0284C7",
          description: "أنواع هبوب الرياح بحسب جهاتها وقوتها",
          words: ["دبور", "صبا", "نعام", "حاصب"]
        },
        {
          id: "love_stages",
          title: "مراتب العشق والصبابة",
          icon: "❤️",
          color: "#BE185D",
          description: "درجات الميل القلبي في فقه اللغة وسر العربية",
          words: ["هوى", "صبابة", "كلف", "عشق"]
        },
        {
          id: "great_lexicons",
          title: "أمهات المعاجم العربية",
          icon: "📖",
          color: "#854D0E",
          description: "موسوعات ألفاظ الضاد الكبرى عبر العصور",
          words: ["اللسان", "القاموس", "العين", "الصحاح"]
        }
      ]
    },
    5: {
      categories: [
        {
          id: "camel_epithets",
          title: "من أسماء ونعوت الإبل",
          icon: "🐪",
          color: "#CA8A04",
          description: "مسميات سفينة الصحراء في أشعار العرب",
          words: ["ناقة", "عيس", "ضامرة", "راحلة"]
        },
        {
          id: "desert_names",
          title: "ألقاب الصحراء والقفار",
          icon: "🏜️",
          color: "#D97706",
          description: "ألفاظ تطلق على المهامة والبراري الشاسعة",
          words: ["بيداء", "فلاة", "تيهاء", "يهماء"]
        },
        {
          id: "generosity_traits",
          title: "نعوت الكرم والندى",
          icon: "🤲",
          color: "#059669",
          description: "أوصاف الجواد باذل المال والمكارم",
          words: ["ندى", "سخي", "فياض", "أريحي"]
        },
        {
          id: "prosody_terms",
          title: "مصطلحات علم العروض",
          icon: "📐",
          color: "#6D28D9",
          description: "أركان بناء البيت الشعري في ميزان الخليل",
          words: ["تفعيلة", "سبب", "وتد", "قافية"]
        }
      ]
    },
    6: {
      categories: [
        {
          id: "spear_names",
          title: "من مسميات الرمح والقنا",
          icon: "🔱",
          color: "#991B1B",
          description: "ألقاب الرماح ونسبتها إلى مواطن صقلها",
          words: ["قنا", "رديني", "خطي", "ذابل"]
        },
        {
          id: "eternity_words",
          title: "ألفاظ الدوام والخلود",
          icon: "♾️",
          color: "#312E81",
          description: "كلمات تعبر عن الأمد اللانهائي والسرمدية",
          words: ["أبد", "سرمد", "أزل", "خلد"]
        },
        {
          id: "birds_of_prey",
          title: "من أسماء كواسر الطير",
          icon: "🦅",
          color: "#B45309",
          description: "ألقاب الصقور والجوارح ذوات المخالب الصائدة",
          words: ["باز", "شاهين", "أجدل", "قطامي"]
        },
        {
          id: "rhetoric_masters",
          title: "أئمة البلاغة والبيان",
          icon: "📜",
          color: "#047857",
          description: "علماء أرسوا قواعد النقد والإعجاز اللغوي",
          words: ["الجاحظ", "الجرجاني", "ابن‌جني", "السكاكي"]
        }
      ]
    },
    7: {
      categories: [
        {
          id: "well_names",
          title: "مسميات البئر في لسان العرب",
          icon: "🪣",
          color: "#0369A1",
          description: "ألفاظ الآبار وتفاوت عمق مياهها وطريقة حفرها",
          words: ["قليب", "جب", "ركية", "طوي"]
        },
        {
          id: "fire_names",
          title: "من أسماء النار ولهيبها",
          icon: "🔥",
          color: "#DC2626",
          description: "مفردات السعير والاشتعال الواردة في التنزيل",
          words: ["لظى", "جحيم", "سعير", "حطمة"]
        },
        {
          id: "wisdom_proofs",
          title: "ألفاظ الحجة والبرهان",
          icon: "⚖️",
          color: "#7E22CE",
          description: "ألفاظ تدل على قطعية الدلالة والبيان الحكيم",
          words: ["فصل", "حجة", "برهان", "بيان"]
        },
        {
          id: "animal_sounds_rare",
          title: "أصوات الخيل والإبل في المعجم",
          icon: "🐎",
          color: "#92400E",
          description: "أوصاف دقيقة لنبرات أصوات الدواب والجياد",
          words: ["صهيل", "حمحمة", "رغاء", "ضبح"]
        }
      ]
    },
    8: {
      categories: [
        {
          id: "deep_darkness",
          title: "من مسميات شدة الظلام",
          icon: "🌑",
          color: "#1E293B",
          description: "درجات سواد الليل الحالك وانحجاب الضياء",
          words: ["غيهب", "دجى", "حندس", "سدف"]
        },
        {
          id: "rain_clouds_noble",
          title: "أوصاف السحاب الماطر والمغيث",
          icon: "☁️",
          color: "#0284C7",
          description: "نعوت الغمام المثقل بماء الغيث النافع",
          words: ["معصرات", "رباب", "صيب", "حيا"]
        },
        {
          id: "death_synonyms",
          title: "من أسماء الموت والمنية",
          icon: "⏳",
          color: "#475569",
          description: "مترادفات انقضاء الأجل في الفصيح من القول",
          words: ["حتف", "حمام", "ردى", "منية"]
        },
        {
          id: "exaggeration_scales",
          title: "أوزان صيغ المبالغة القياسية",
          icon: "⚖️",
          color: "#B45309",
          description: "صيغ صرفية تدل على الكثرة وقوة حدوث الفعل",
          words: ["فعال", "مفعال", "فعول", "فعيل"]
        }
      ]
    },
    9: {
      categories: [
        {
          id: "quranic_flora",
          title: "نباتات وأشجار وردت في القرآن",
          icon: "🌿",
          color: "#15803D",
          description: "أشجار وثمار جليلة خلد ذكرها الكتاب الحكيم",
          words: ["سدر", "طلح", "زيتون", "يقطين"]
        },
        {
          id: "light_splendors",
          title: "مراتب النور والضياء",
          icon: "☀️",
          color: "#EAB308",
          description: "ألفاظ تدرج الإشراق وسطوع الأشعة",
          words: ["سنا", "ضياء", "وهج", "إشراق"]
        },
        {
          id: "serpent_names",
          title: "من مسميات الحية والصل",
          icon: "🐍",
          color: "#4D7C0F",
          description: "ألقاب الزواحف السامة في أدب الصحراء",
          words: ["ثعبان", "أرقم", "حية", "أيم"]
        },
        {
          id: "eloquence_grades",
          title: "نعوت الفصاحة والبيان",
          icon: "🎙️",
          color: "#6D28D9",
          description: "صفات المتحدث الطلق اللسان القادر على الإقناع",
          words: ["مصقع", "لسن", "بليغ", "مفوه"]
        }
      ]
    },
    10: {
      categories: [
        {
          id: "gold_silver_terms",
          title: "من مسميات الذهب والفضة",
          icon: "✨",
          color: "#CA8A04",
          description: "ألفاظ الصامت الثمين من المعادن في الفصحى",
          words: ["عقيان", "تبر", "عسجد", "لجين"]
        },
        {
          id: "bird_beast_cries",
          title: "أصوات الطير والسباع المأثورة",
          icon: "🦉",
          color: "#B91C1C",
          description: "أصوات الكائنات في معجم فقه اللغة للثعالبي",
          words: ["هديل", "زئير", "عواء", "نعيق"]
        },
        {
          id: "muallaqat_poets",
          title: "من شعراء المعلقات العشر",
          icon: "👑",
          color: "#78350F",
          description: "فرسان الشعر الجاهلي وأصحاب القصائد الذهبية",
          words: ["امرؤ‌القيس", "زهير", "عنترة", "طرفة"]
        },
        {
          id: "nobility_titles",
          title: "ألقاب السيادة والرفعة",
          icon: "🎖️",
          color: "#047857",
          description: "نعوت القادة والأشراف ذوي الهمم العالية",
          words: ["همام", "قيل", "غطريف", "صنديد"]
        }
      ]
    }
  }
};

export function getFallbackLevel(difficulty: Difficulty, levelNumber: number): GameLevel {
  const diffGroup = FALLBACK_DATABASE[difficulty] || FALLBACK_DATABASE[Difficulty.BEGINNER];
  const validLevelNum = (typeof levelNumber === 'number' && levelNumber >= 1 && levelNumber <= 10) ? levelNumber : 1;
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
