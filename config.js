/**
 * 🛠️ ملف الإعدادات والبيانات الشخصية / Personal Configuration File
 * يمكنك تعديل بياناتك وروابطك بسهولة من هنا مباشرة
 */

const profileData = {
  // المعلومات الشخصية / Personal Info
  name: "اسمك هنا | Your Name",
  title: "مطور برمجيات & مصمم واجهات | Software Engineer & Designer",
  bio: "مرحباً بك في صفحتي الشخصية! هنا تجد كل روابطي وحساباتي على منصات التواصل ومشاريعي.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", // ضع رابط صورتك الشخصية أو مسارها مثل: "avatar.jpg"
  location: "القاهرة، مصر | Cairo, Egypt",
  status: "متاح للعمل الحر 🚀 | Available for projects", // نص الحالة أو اتركه فارغاً

  // إعدادات المظهر / Theme Settings
  theme: {
    defaultMode: "dark", // "dark" أو "light"
    accentColor: "#6366f1", // لون التمييز الأساسي (Hex)
    backgroundGlow: true // تشغيل توهج الخلفية التفاعلي
  },

  // الروابط السريعة المصغرة أعلى الصفحة (Social Icons Bar)
  socialBar: [
    { platform: "github", url: "https://github.com/yourusername", icon: "fab fa-github", label: "GitHub" },
    { platform: "linkedin", url: "https://linkedin.com/in/yourusername", icon: "fab fa-linkedin-in", label: "LinkedIn" },
    { platform: "twitter", url: "https://twitter.com/yourusername", icon: "fab fa-x-twitter", label: "X (Twitter)" },
    { platform: "instagram", url: "https://instagram.com/yourusername", icon: "fab fa-instagram", label: "Instagram" },
    { platform: "whatsapp", url: "https://wa.me/201000000000", icon: "fab fa-whatsapp", label: "WhatsApp" },
    { platform: "email", url: "mailto:your.email@example.com", icon: "fas fa-envelope", label: "Email" }
  ],

  // قائمة الروابط والبطاقات الرئيسية / Main Link Cards
  links: [
    {
      id: "portfolio",
      title: "موقعي الشخصي / Portfolio",
      description: "تصفح أحدث أعمالي ومشاريعي السابقة",
      url: "https://yourwebsite.com",
      icon: "fas fa-globe",
      highlight: true, // يظهر بتمييز ولمعان خاص
      badge: "الرئيسي ✨"
    },
    {
      id: "github-projects",
      title: "مشاريع مفتوحة المصدر | GitHub",
      description: "الأكواد والمكتبات البرمجية التي طورتها",
      url: "https://github.com/yourusername",
      icon: "fab fa-github",
      highlight: false,
      badge: ""
    },
    {
      id: "linkedin-connect",
      title: "شبكة لينكد إن | LinkedIn",
      description: "للتواصل المهني وفرص العمل والشراكات",
      url: "https://linkedin.com/in/yourusername",
      icon: "fab fa-linkedin",
      highlight: false,
      badge: ""
    },
    {
      id: "whatsapp-direct",
      title: "تواصل مباشر عبر واتساب | WhatsApp",
      description: "دردشة سريعة ومباشرة لأي استفسار",
      url: "https://wa.me/201000000000",
      icon: "fab fa-whatsapp",
      highlight: false,
      badge: "سريع ⚡"
    },
    {
      id: "youtube-channel",
      title: "قناتي على يوتيوب | YouTube",
      description: "دروس وشروحات ومحتوى تقني مفيد",
      url: "https://youtube.com/@yourchannel",
      icon: "fab fa-youtube",
      highlight: false,
      badge: ""
    },
    {
      id: "cv-resume",
      title: "تحميل السيرة الذاتية | Download CV",
      description: "ملف PDF يحتوي على الخبرات والمهارات",
      url: "https://yourwebsite.com/cv.pdf",
      icon: "fas fa-file-arrow-down",
      highlight: false,
      badge: "PDF"
    }
  ],

  // تذييل الصفحة / Footer
  footerText: "© 2026 جميع الحقوق محفوظة | صُممت بكل ❤️"
};

// إتاحة البيانات للتطبيق
if (typeof window !== "undefined") {
  window.profileData = profileData;
}
