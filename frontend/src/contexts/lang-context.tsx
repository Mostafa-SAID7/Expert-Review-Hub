import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

const AR = {
  appName: "نظام الطيبات الغذائي",
  appShort: "الطيبات",
  tagline: "منهج د. ضياء العوضي",
  switchLang: "EN",

  /* nav */
  nav_home: "الرئيسية",
  nav_tracker: "التتبع اليومي",
  nav_dashboard: "لوحة القيادة",
  nav_guide: "دليل الطيبات",
  nav_plans: "الخطط",
  nav_recipes: "الوصفات",
  nav_profile: "حسابي",
  nav_guide_guest: "دليل الطيبات",

  /* auth */
  login: "تسجيل الدخول",
  register: "حساب جديد",
  logout: "تسجيل الخروج",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  name: "الاسم الكامل",
  login_heading: "تسجيل الدخول",
  login_sub: "مرحباً بعودتك إلى رحلة التشافي الخاصة بك",
  register_heading: "إنشاء حساب جديد",
  register_sub: "ابدأ رحلتك مع نظام الطيبات اليوم",
  no_account: "ليس لديك حساب؟",
  have_account: "لديك حساب بالفعل؟",
  login_link: "حساب جديد",
  login_back: "تسجيل الدخول",

  /* notifications */
  notifications: "الإشعارات",
  no_notifications: "لا توجد إشعارات",
  mark_all_read: "تعيين الكل كمقروء",
  notif_welcome: "مرحباً بك في نظام الطيبات!",
  notif_welcome_body: "ابدأ بتسجيل وجبتك الأولى",
  notif_meal_added: "تم إضافة الوجبة",
  notif_water_added: "تم تسجيل شرب الماء",
  notif_plan_created: "تم إنشاء خطة جديدة",

  /* home */
  home_hero_badge: "منهج د. ضياء العوضي",
  home_hero_title: "نظام الطيبات الغذائي",
  home_hero_sub: "تطبيق شخصي لتتبع صحتك وغذائك. يعتمد على فصل الطيبات عن الخبائث لمساعدة جسمك على التشافي الذاتي واستعادة طاقته.",
  home_cta_start: "ابدأ تتبعك",
  home_cta_guide: "دليل الأطعمة",
  home_philosophy: "فلسفة النظام",
  home_cta_section: "جاهز لبدء رحلة التشافي؟",
  home_cta_section_sub: "سجل الآن مجاناً وتتبع وجباتك، الصيام، ومستويات طاقتك يومياً مع نظام الطيبات.",
  home_start_free: "ابدأ الآن مجاناً",

  /* tracker */
  tracker_title: "التتبع اليومي",
  tracker_tayyib: "الطيبات",
  tracker_khabeeth: "الخبائث",
  tracker_water: "الماء",
  tracker_fasting: "الصيام",
  tracker_add_meal: "إضافة وجبة",
  tracker_what_ate: "ماذا أكلت؟",
  tracker_tayyib_btn: "طيب",
  tracker_khabeeth_btn: "خبيث",
  tracker_add_btn: "إضافة",
  tracker_log_title: "سجل اليوم",
  tracker_empty: "لا توجد مدخلات اليوم",
  tracker_loading: "جاري التحميل...",
  tracker_water_short: "مل",
  tracker_hours: "ساعة",
  tracker_water_add: "+250 مل",

  /* dashboard */
  dashboard_title: "لوحة القيادة",
  dash_adherence: "نسبة الالتزام بالطيبات",
  dash_streak: "أيام الالتزام المتتالية",
  dash_total: "إجمالي الوجبات المسجلة",
  dash_chart_adherence: "الالتزام بالطيبات (أسبوعين)",
  dash_chart_water: "شرب الماء (أسبوعين)",
  dash_chart_loading: "جاري التحميل...",
  dash_adherence_pct: "الالتزام %",
  dash_water_ml: "الماء (مل)",

  /* guide */
  guide_title: "دليل أطعمة الطيبات",
  guide_sub: "ابحث واكتشف الأطعمة المسموحة (الطيبات) والممنوعة (الخبائث) في نظام د. ضياء العوضي.",
  guide_search: "ابحث عن طعام...",
  guide_classification: "التصنيف",
  guide_sections: "الأقسام",
  guide_all: "الكل",
  guide_tayyib: "طيبات",
  guide_khabeeth: "خبائث",
  guide_not_found: "لم نجد أي أطعمة",
  guide_try_other: "جرب كلمات بحث مختلفة",

  /* plans */
  plans_title: "خطط الوجبات",
  plans_sub: "نظّم وجباتك الأسبوعية وفق أهدافك الصحية",
  plans_new: "خطة جديدة",
  plans_create_title: "إنشاء خطة جديدة",
  plans_name_label: "اسم الخطة",
  plans_name_ph: "مثال: خطة رمضان الصحية",
  plans_goal_label: "الهدف الصحي",
  plans_goal_ph: "اختر الهدف",
  plans_start_label: "تاريخ البداية",
  plans_notes_label: "ملاحظات (اختياري)",
  plans_notes_ph: "أي ملاحظات إضافية...",
  plans_submit: "إنشاء الخطة",
  plans_submitting: "جاري الإنشاء...",
  plans_cancel: "إلغاء",
  plans_empty_title: "لا توجد خطط بعد",
  plans_empty_sub: "أنشئ خطتك الأولى لتنظيم وجباتك الأسبوعية",
  plans_meals_label: "وجبة",
  plans_default_meals: "وجبات افتراضية",
  plans_show_less: "عرض أقل",
  plans_show_more: "عرض التفاصيل",

  /* recipes */
  recipes_title: "وصفات الطيبات",
  recipes_sub: "مجموعة وصفات صحية متوافقة مع نظام الطيبات الغذائي",
  recipes_search: "ابحث في الوصفات...",
  recipes_all: "الكل",
  recipes_all_goals: "كل الأهداف",
  recipes_count: "وصفة",
  recipes_no_results: "لا توجد نتائج",
  recipes_empty: "لا توجد وصفات تطابق البحث",
  recipes_tap_detail: "اضغط لعرض التفاصيل",
  recipes_hide: "إخفاء التفاصيل",
  recipes_ingredients: "المكونات",
  recipes_instructions: "طريقة التحضير",
  recipes_minutes: "دقيقة",
  recipes_people: "أشخاص",

  /* profile */
  profile_title: "الملف الشخصي",

  /* footer */
  footer_disclaimer_title: "تنبيه",
  footer_disclaimer: "هذا النظام للتوعية الصحية فقط وليس بديلاً عن الاستشارة الطبية.",
  footer_tagline: "منهج د. ضياء العوضي للصحة والتغذية.",

  /* common */
  loading: "جاري التحميل...",
  delete: "حذف",
  cancel: "إلغاء",
  save: "حفظ",
  days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  today: "اليوم",
} as const;

const EN: Record<keyof typeof AR, any> = {
  appName: "Tayyibat Food System",
  appShort: "Tayyibat",
  tagline: "Dr. Dhia Al-Awadi Method",
  switchLang: "عر",

  nav_home: "Home",
  nav_tracker: "Daily Tracker",
  nav_dashboard: "Dashboard",
  nav_guide: "Food Guide",
  nav_plans: "Plans",
  nav_recipes: "Recipes",
  nav_profile: "My Account",
  nav_guide_guest: "Food Guide",

  login: "Login",
  register: "Register",
  logout: "Logout",
  email: "Email Address",
  password: "Password",
  name: "Full Name",
  login_heading: "Sign In",
  login_sub: "Welcome back to your healing journey",
  register_heading: "Create Account",
  register_sub: "Start your Tayyibat journey today",
  no_account: "Don't have an account?",
  have_account: "Already have an account?",
  login_link: "Register",
  login_back: "Login",

  notifications: "Notifications",
  no_notifications: "No notifications",
  mark_all_read: "Mark all as read",
  notif_welcome: "Welcome to Tayyibat!",
  notif_welcome_body: "Start by logging your first meal",
  notif_meal_added: "Meal added",
  notif_water_added: "Water intake logged",
  notif_plan_created: "New plan created",

  home_hero_badge: "Dr. Dhia Al-Awadi Method",
  home_hero_title: "Tayyibat Food System",
  home_hero_sub: "A personal app to track your health and nutrition. Based on separating wholesome foods (Tayyibat) from harmful ones (Khabeeth) to help your body self-heal.",
  home_cta_start: "Start Tracking",
  home_cta_guide: "Food Guide",
  home_philosophy: "System Philosophy",
  home_cta_section: "Ready to start your healing journey?",
  home_cta_section_sub: "Register for free and track your meals, fasting, and energy levels daily with Tayyibat.",
  home_start_free: "Start for Free",

  tracker_title: "Daily Tracker",
  tracker_tayyib: "Tayyib",
  tracker_khabeeth: "Khabeeth",
  tracker_water: "Water",
  tracker_fasting: "Fasting",
  tracker_add_meal: "Add Meal",
  tracker_what_ate: "What did you eat?",
  tracker_tayyib_btn: "Tayyib",
  tracker_khabeeth_btn: "Khabeeth",
  tracker_add_btn: "Add",
  tracker_log_title: "Today's Log",
  tracker_empty: "No entries today",
  tracker_loading: "Loading...",
  tracker_water_short: "ml",
  tracker_hours: "hrs",
  tracker_water_add: "+250 ml",

  dashboard_title: "Dashboard",
  dash_adherence: "Tayyibat Adherence Rate",
  dash_streak: "Current Streak",
  dash_total: "Total Meals Logged",
  dash_chart_adherence: "Tayyibat Adherence (2 weeks)",
  dash_chart_water: "Water Intake (2 weeks)",
  dash_chart_loading: "Loading...",
  dash_adherence_pct: "Adherence %",
  dash_water_ml: "Water (ml)",

  guide_title: "Tayyibat Food Guide",
  guide_sub: "Search and discover permitted (Tayyibat) and forbidden (Khabeeth) foods in Dr. Dhia Al-Awadi's system.",
  guide_search: "Search foods...",
  guide_classification: "Classification",
  guide_sections: "Sections",
  guide_all: "All",
  guide_tayyib: "Tayyibat",
  guide_khabeeth: "Khabeeth",
  guide_not_found: "No foods found",
  guide_try_other: "Try different search terms",

  plans_title: "Meal Plans",
  plans_sub: "Organise your weekly meals according to your health goals",
  plans_new: "New Plan",
  plans_create_title: "Create New Plan",
  plans_name_label: "Plan Name",
  plans_name_ph: "e.g. Ramadan Healthy Plan",
  plans_goal_label: "Health Goal",
  plans_goal_ph: "Choose goal",
  plans_start_label: "Start Date",
  plans_notes_label: "Notes (optional)",
  plans_notes_ph: "Any additional notes...",
  plans_submit: "Create Plan",
  plans_submitting: "Creating...",
  plans_cancel: "Cancel",
  plans_empty_title: "No plans yet",
  plans_empty_sub: "Create your first plan to organise your weekly meals",
  plans_meals_label: "meal",
  plans_default_meals: "Default meals",
  plans_show_less: "Show less",
  plans_show_more: "View details",

  recipes_title: "Tayyibat Recipes",
  recipes_sub: "A collection of healthy recipes compatible with the Tayyibat food system",
  recipes_search: "Search recipes...",
  recipes_all: "All",
  recipes_all_goals: "All Goals",
  recipes_count: "recipe",
  recipes_no_results: "No results",
  recipes_empty: "No recipes match your search",
  recipes_tap_detail: "Tap to view details",
  recipes_hide: "Hide details",
  recipes_ingredients: "Ingredients",
  recipes_instructions: "Instructions",
  recipes_minutes: "min",
  recipes_people: "servings",

  profile_title: "Profile",

  footer_disclaimer_title: "Notice",
  footer_disclaimer: "This system is for health awareness only and is not a substitute for medical consultation.",
  footer_tagline: "Dr. Dhia Al-Awadi's methodology for health and nutrition.",

  loading: "Loading...",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};

export type TranslationKey = keyof typeof AR;

interface LangContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: "ar",
  dir: "rtl",
  t: (k) => AR[k] as string,
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("tayyibat_lang") as Lang | null;
      if (saved === "ar" || saved === "en") return saved;
    } catch {}
    return "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  const t = (key: TranslationKey): string => {
    const dict = lang === "ar" ? AR : EN;
    const val = dict[key];
    if (Array.isArray(val)) return val.join(", ");
    return val as string;
  };

  const toggleLang = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    try {
      localStorage.setItem("tayyibat_lang", next);
    } catch {}
    setLang(next);
  };

  return (
    <LangContext.Provider value={{ lang, dir, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
export { AR, EN };
