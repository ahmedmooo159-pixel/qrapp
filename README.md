# 🌟 صفحة الروابط الشخصية مع التخزين السحابي على Firebase
### Personal Bio Links Landing Page + Firebase Cloud Sync

صفحة هبوط شخصية سريعة وفخمة لمشاركة كل روابطك وحساباتك ومشاريعك، بتصميم زجاجي عصري وتأثيرات بصرية مميزة، مع **تخزين سحابي ومزامنة مباشرة عبر Google Firebase**.

---

## ✨ المميزات الحديثة

- ☁️ **تخزين ومزامنة سحابية على Firebase Firestore**:
  - يتم جلب البيانات وتحديثها فورياً ومباشرة لجميع الزوار عبر تقنية الـ Real-time Listeners (`onSnapshot`).
  - يمكنك تعديل الروابط أو البيانات من الهاتف أو الكمبيوتر وستتغير فوراً لدى كل من يفتح الرابط دون الحاجة لإعادة نشر الكود!
- 🎨 **تصميم فائق الجمال**: تأثيرات إضاءة متدرجة متحركة، بطاقات زجاجية فاخرة (Glassmorphism)، ودعم كامل للخطوط العربية والإنجليزية.
- 🌓 **وضع ليلي / نهاري (Dark & Light Mode)**.
- 📱 **متجاوبة 100% مع شاشات الهواتف والأجهزة اللوحية والكمبيوتر**.
- ⚡ **توليد كود QR تلقائياً مع زر تحميل PNG فوري**.
- 🛠️ **لوحة تحكم وتعديل مرئي مباشر (Live Visual Customizer)** لتعديل بياناتك أو إعدادات Firebase من المتصفح مباشرة.

---

## 🔥 كيفية ربط وتفعيل Firebase (في 3 دقائق مجاناً):

### الخطوة 1: إنشاء مشروع Firebase
1. افتح موقع [Firebase Console](https://console.firebase.google.com).
2. اضغط على **Add Project** وسمّه مثلاً `my-bio-links`.
3. اضغط على أيقونة الويب `</>` لإنشاء Web App.
4. انسخ كود الـ `firebaseConfig` المعروض لك.

### الخطوة 2: تفعيل قاعدة بيانات Firestore
1. من القائمة الجانبية في Firebase، اضغط على **Firestore Database** ⬅️ **Create Database**.
2. اختر الموقع الجغرافي القريب منك.
3. في تبويب **Rules** (القواعد)، اسمح بالقراءة والكتابة:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
4. اضغط **Publish**.

### الخطوة 3: إضافة بيانات الربط للمشروع
يمكنك وضع البيانات بإحدى طريقتين:
- **الطريقة 1 (من الكود مباشرة)**: افتح ملف [`firebase-config.js`](file:///d:/qr%20code/firebase-config.js) وضع قيمك الحقيقية:
  ```javascript
  export const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "...",
    appId: "1:...:web:..."
  };
  ```
- **الطريقة 2 (من المتصفح بدون كود)**: افتح موقعك، اضغط على زر القلم 📝، اذهب إلى تبويب **إعدادات Firebase** وأدخل الـ `API Key` و `Project ID` واضغط حفظ!

---

## 🚀 النشر والاستضافة المجانية:

### أ) النشر على GitHub Pages:
```bash
git init
git add .
git commit -m "Add Firebase support to bio page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
من إعدادات المستودع (**Settings** > **Pages**) اختر **GitHub Actions** أو النشر من فرع `main`.

### ب) النشر على Vercel:
1. ادخل على [Vercel.com](https://vercel.com) وسجل بحسابك.
2. اضغط **Add New** > **Project** واختر مستودع الـ GitHub واضغط **Deploy**.

---

## 📁 هيكل الملفات:

```text
├── index.html            # الصفحة الرئيسية مع شارة المزامنة السحابية
├── style.css             # التنسيقات والوضع الليلي والمؤثرات
├── firebase-config.js    # ⚙️ إعدادات الربط بقاعدة بيانات Firebase Firestore
├── config.js             # البيانات الاحتياطية الافتراضية
├── app.js                # المنطق البرمجي والمزامنة الحية وتوليد QR
├── vercel.json           # إعدادات Vercel
├── .github/workflows/    # إعدادات GitHub Actions النشر التلقائي
└── README.md             # هذا الدليل
```
