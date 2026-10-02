/**
 * 🛰️ إعدادات فايربيس / Firebase Configuration
 * تم ضبطها وربطها بنجاح بمشروعك: qrapp-ca92c
 */

export const firebaseConfig = {
  apiKey: "AIzaSyCHCg_8DH882itlVL_0D8lz1r-mliJ5SbI",
  authDomain: "qrapp-ca92c.firebaseapp.com",
  projectId: "qrapp-ca92c",
  storageBucket: "qrapp-ca92c.firebasestorage.app",
  messagingSenderId: "644200982434",
  appId: "1:644200982434:web:aa378300a9b3a181f874fb",
  measurementId: "G-87E2E6TRM4"
};

// اسم المجموعة والمستند في Firestore
export const DB_COLLECTION = "profiles";
export const DB_DOC_ID = "main_profile";

/**
 * التحقق من اكتمال الإعدادات
 */
export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
