/**
 * 🚀 Personal Bio Links Application Logic with Firebase Cloud Sync
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { firebaseConfig, DB_COLLECTION, DB_DOC_ID, isFirebaseConfigured } from "./firebase-config.js";

// Global App State
let appData = null;
let db = null;
let analytics = null;
let firebaseActive = false;

// DOM Elements
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileTitle = document.getElementById("profileTitle");
const profileBio = document.getElementById("profileBio");
const profileLocation = document.getElementById("profileLocation");
const locationWrapper = document.getElementById("locationWrapper");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const socialBar = document.getElementById("socialBar");
const linksContainer = document.getElementById("linksContainer");
const footerText = document.getElementById("footerText");
const cloudStatus = document.getElementById("cloudStatus");
const cloudStatusText = document.getElementById("cloudStatusText");

// Modals & Buttons
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const closeQrModal = document.getElementById("closeQrModal");
const qrCanvas = document.getElementById("qrCanvas");
const downloadQrBtn = document.getElementById("downloadQrBtn");
const copyProfileLinkBtn = document.getElementById("copyProfileLinkBtn");
const shareBtn = document.getElementById("shareBtn");

const editModalBtn = document.getElementById("editModalBtn");
const quickEditFooterBtn = document.getElementById("quickEditFooterBtn");
const editorModal = document.getElementById("editorModal");
const closeEditorModal = document.getElementById("closeEditorModal");
const saveVisualChangesBtn = document.getElementById("saveVisualChangesBtn");
const exportConfigBtn = document.getElementById("exportConfigBtn");
const addNewLinkBtn = document.getElementById("addNewLinkBtn");
const editableLinksList = document.getElementById("editableLinksList");

// Tabs in Editor Modal
const tabInfoBtn = document.getElementById("tabInfoBtn");
const tabFirebaseBtn = document.getElementById("tabFirebaseBtn");
const tabInfoContent = document.getElementById("tabInfoContent");
const tabFirebaseContent = document.getElementById("tabFirebaseContent");
const testFirebaseBtn = document.getElementById("testFirebaseBtn");

let qrInstance = null;

/**
 * 1. Initialize Firebase & Firestore
 */
async function setupFirebase() {
  // Check if credentials exist in localStorage first, then in firebase-config.js
  const storedFb = localStorage.getItem("my_custom_firebase_config");
  let activeConfig = firebaseConfig;
  
  if (storedFb) {
    try {
      activeConfig = JSON.parse(storedFb);
    } catch (e) {
      console.error(e);
    }
  }

  const valid = activeConfig.apiKey && activeConfig.apiKey !== "YOUR_API_KEY" && activeConfig.projectId && activeConfig.projectId !== "YOUR_PROJECT_ID";

  if (valid) {
    try {
      const fbApp = initializeApp(activeConfig);
      db = getFirestore(fbApp);
      
      // Initialize Firebase Analytics if supported in environment
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(fbApp);
        }
      }).catch(() => {});

      firebaseActive = true;

      cloudStatus.className = "cloud-status-badge connected";
      cloudStatusText.textContent = "متصل سحابياً (Firebase)";
      cloudStatus.title = `متصل بقاعدة بيانات: ${activeConfig.projectId}`;

      // Realtime listener for live sync across all devices!
      const docRef = doc(db, DB_COLLECTION, DB_DOC_ID);
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          appData = docSnap.data();
          localStorage.setItem("my_personal_bio_data", JSON.stringify(appData));
          renderProfile();
        } else {
          // If doc doesn't exist yet in Firestore, upload current local profile
          setDoc(docRef, appData || window.profileData || {});
        }
      }, (error) => {
        console.warn("Firestore listener note:", error);
      });

      return true;
    } catch (err) {
      console.error("Firebase init failed:", err);
      cloudStatus.className = "cloud-status-badge local";
      cloudStatusText.textContent = "وضع محلي (Local)";
      return false;
    }
  } else {
    cloudStatus.className = "cloud-status-badge local";
    cloudStatusText.textContent = "وضع محلي (Local)";
    return false;
  }
}

/**
 * 2. Initialize Data State
 */
function initializeData() {
  const savedData = localStorage.getItem("my_personal_bio_data");
  if (savedData) {
    try {
      appData = JSON.parse(savedData);
    } catch (e) {
      console.error("Error loading saved data, fallback to config.js", e);
      appData = window.profileData || {};
    }
  } else {
    appData = window.profileData || {};
  }
}

/**
 * 3. Render Profile
 */
function renderProfile() {
  if (!appData) return;

  // Personal Info
  profileAvatar.src = appData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400";
  profileAvatar.alt = appData.name || "Avatar";
  profileName.textContent = appData.name || "Your Name";
  profileTitle.textContent = appData.title || "";
  profileBio.textContent = appData.bio || "";
  
  if (appData.location) {
    profileLocation.textContent = appData.location;
    locationWrapper.style.display = "inline-flex";
  } else {
    locationWrapper.style.display = "none";
  }

  if (appData.status) {
    statusText.textContent = appData.status;
    statusBadge.style.display = "inline-flex";
  } else {
    statusBadge.style.display = "none";
  }

  footerText.textContent = appData.footerText || "© 2026 جميع الحقوق محفوظة | صُممت بكل ❤️";

  // Render Social Bar Icons
  socialBar.innerHTML = "";
  if (Array.isArray(appData.socialBar)) {
    appData.socialBar.forEach((item) => {
      if (!item.url) return;
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-icon-btn";
      a.title = item.label || item.platform;
      a.setAttribute("aria-label", item.label || item.platform);
      a.innerHTML = `<i class="${item.icon}"></i>`;
      socialBar.appendChild(a);
    });
  }

  // Render Main Link Cards
  linksContainer.innerHTML = "";
  if (Array.isArray(appData.links)) {
    appData.links.forEach((link, idx) => {
      const card = document.createElement("a");
      card.href = link.url || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = `link-card animate-fade-in ${link.highlight ? "highlighted" : ""}`;
      card.style.animationDelay = `${idx * 0.08}s`;

      const badgeHtml = link.badge ? `<span class="link-badge">${link.badge}</span>` : "";
      const descHtml = link.description ? `<p class="link-desc">${link.description}</p>` : "";

      card.innerHTML = `
        <div class="link-card-content">
          <div class="link-icon-box">
            <i class="${link.icon || 'fas fa-link'}"></i>
          </div>
          <div class="link-text-details">
            <div class="link-title">
              <span>${link.title}</span>
              ${badgeHtml}
            </div>
            ${descHtml}
          </div>
        </div>
        <div class="link-arrow">
          <i class="fas fa-chevron-left rtl-arrow"></i>
        </div>
      `;

      linksContainer.appendChild(card);
    });
  }
}

/**
 * 4. Theme Toggle
 */
function initTheme() {
  const savedTheme = localStorage.getItem("app_theme") || (appData.theme && appData.theme.defaultMode) || "dark";
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("app_theme", theme);
  if (theme === "dark") {
    themeIcon.className = "fas fa-sun";
  } else {
    themeIcon.className = "fas fa-moon";
  }
}

/**
 * 5. QR Code Modal
 */
// QR Studio Elements
const qrBadgeAvatar = document.getElementById("qrBadgeAvatar");
const qrBadgeName = document.getElementById("qrBadgeName");
const qrBadgeUrlText = document.getElementById("qrBadgeUrlText");
const qrTextTarget = document.getElementById("qrTextTarget");
const qrDarkColor = document.getElementById("qrDarkColor");
const qrLightColor = document.getElementById("qrLightColor");
const qrPresetSelect = document.getElementById("qrPresetSelect");

const directShareQrBtn = document.getElementById("directShareQrBtn");
const downloadQrBadgeBtn = document.getElementById("downloadQrBadgeBtn");
const downloadQrOnlyBtn = document.getElementById("downloadQrOnlyBtn");

/**
 * 5. QR Code Studio Generation & Customization
 */
function updateQrStudio() {
  qrCanvas.innerHTML = "";
  const targetUrl = qrTextTarget.value.trim() || window.location.href;
  const dark = qrDarkColor.value || "#0f172a";
  const light = qrLightColor.value || "#ffffff";

  // Update Badge Texts & Avatar
  qrBadgeAvatar.src = appData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";
  qrBadgeName.textContent = appData.name || "صفحتي الشخصية";
  qrBadgeUrlText.textContent = targetUrl.replace(/^https?:\/\//, "");

  if (typeof QRCode !== "undefined") {
    qrInstance = new QRCode(qrCanvas, {
      text: targetUrl,
      width: 175,
      height: 175,
      colorDark: dark,
      colorLight: light,
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

function openQrModal() {
  if (!qrTextTarget.value) {
    qrTextTarget.value = window.location.href;
  }
  updateQrStudio();
  qrModal.classList.add("active");
}

function closeQrModalView() {
  qrModal.classList.remove("active");
}

const featuredQrCard = document.getElementById("featuredQrCard");
const openQrStudioCardBtn = document.getElementById("openQrStudioCardBtn");

if (featuredQrCard) {
  featuredQrCard.addEventListener("click", openQrModal);
}
if (openQrStudioCardBtn) {
  openQrStudioCardBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openQrModal();
  });
}

qrBtn.addEventListener("click", openQrModal);
closeQrModal.addEventListener("click", closeQrModalView);
qrModal.addEventListener("click", (e) => {
  if (e.target === qrModal) closeQrModalView();
});

// Realtime QR customizer events
qrTextTarget.addEventListener("input", updateQrStudio);
qrDarkColor.addEventListener("input", updateQrStudio);
qrLightColor.addEventListener("input", updateQrStudio);

// Presets Handler
qrPresetSelect.addEventListener("change", (e) => {
  const val = e.target.value;
  if (val === "classic") {
    qrDarkColor.value = "#0f172a";
    qrLightColor.value = "#ffffff";
  } else if (val === "indigo") {
    qrDarkColor.value = "#4f46e5";
    qrLightColor.value = "#eef2ff";
  } else if (val === "emerald") {
    qrDarkColor.value = "#059669";
    qrLightColor.value = "#ecfdf5";
  } else if (val === "sunset") {
    qrDarkColor.value = "#e11d48";
    qrLightColor.value = "#fff1f2";
  }
  updateQrStudio();
});

// Download QR Code Only
downloadQrOnlyBtn.addEventListener("click", () => {
  const img = qrCanvas.querySelector("img") || qrCanvas.querySelector("canvas");
  if (img) {
    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = img.src || (img.toDataURL ? img.toDataURL("image/png") : "");
    link.click();
    showToast("تم تحميل رمز QR بنجاح! 📥");
  }
});

// Download Full High-Resolution Badge Card (Canvas composite)
downloadQrBadgeBtn.addEventListener("click", async () => {
  showToast("جاري إنشاء بطاقة QR بجودة عالية... 🎨");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = 600;
  const height = 780;
  canvas.width = width;
  canvas.height = height;

  // Background Gradient Card
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0b0f19");
  grad.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, width, height, 32);
  ctx.fill();

  // Border
  ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Title & Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Alexandria, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(appData.name || "My Bio Profile", width / 2, 90);

  ctx.fillStyle = "#a5b4fc";
  ctx.font = "20px Alexandria, sans-serif";
  ctx.fillText(appData.title || "امسح الرمز لزيارة الصفحة", width / 2, 130);

  // QR Container Box
  const qrBoxSize = 380;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = 170;
  ctx.fillStyle = qrLightColor.value || "#ffffff";
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
  ctx.fill();

  // Draw QR Image
  const qrImg = qrCanvas.querySelector("img");
  if (qrImg && qrImg.src) {
    const qrImageObj = new Image();
    qrImageObj.crossOrigin = "anonymous";
    qrImageObj.src = qrImg.src;
    await new Promise(r => qrImageObj.onload = r);
    ctx.drawImage(qrImageObj, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);
  }

  // Footer URL
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 22px Outfit, monospace";
  const urlText = (qrTextTarget.value.trim() || window.location.href).replace(/^https?:\/\//, "");
  ctx.fillText(urlText, width / 2, 600);

  // Subtitle
  ctx.fillStyle = "#94a3b8";
  ctx.font = "18px Alexandria, sans-serif";
  ctx.fillText("امسح بالكاميرا للتواصل ومتابعة المشاريع 🚀", width / 2, 650);

  // Download Trigger
  const link = document.createElement("a");
  link.download = `my-profile-badge-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("تم تحميل بطاقة QR الكاملة بنجاح! 🪪✨");
});

// Direct Web Share with QR
directShareQrBtn.addEventListener("click", async () => {
  const targetUrl = qrTextTarget.value.trim() || window.location.href;
  const title = appData.name || "صفحتي الشخصية";
  const text = `تفضل بزيارة صفحتي وروابطي الشخصية:\n${targetUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: targetUrl });
      showToast("تم فتح نافذة المشاركة! 🚀");
    } catch (e) {
      if (e.name !== "AbortError") {
        copyToClipboard(targetUrl);
      }
    }
  } else {
    // Fallback: copy link & open whatsapp share option
    copyToClipboard(targetUrl);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  }
});

/**
 * 6. Share Profile
 */
async function shareProfile() {
  const shareData = {
    title: appData.name || "صفحتي الشخصية",
    text: appData.bio || "تفضل بزيارة صفحتي وروابطي الشخصية",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== "AbortError") {
        copyToClipboard(window.location.href);
      }
    }
  } else {
    copyToClipboard(window.location.href);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("تم نسخ رابط الصفحة إلى الحافظة! 📋");
  }).catch(() => {
    showToast("تعذر النسخ تلقائياً");
  });
}

shareBtn.addEventListener("click", shareProfile);
copyProfileLinkBtn.addEventListener("click", () => copyToClipboard(window.location.href));

/**
 * 7. Toast Notification Helper
 */
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fas fa-circle-check" style="color: #22c55e;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/**
 * 8. Visual Customizer Modal & Tabs
 */
tabInfoBtn.addEventListener("click", () => {
  tabInfoBtn.classList.add("active");
  tabFirebaseBtn.classList.remove("active");
  tabInfoContent.style.display = "block";
  tabFirebaseContent.style.display = "none";
});

tabFirebaseBtn.addEventListener("click", () => {
  tabFirebaseBtn.classList.add("active");
  tabInfoBtn.classList.remove("active");
  tabFirebaseContent.style.display = "block";
  tabInfoContent.style.display = "none";
});

// Avatar file picker and preview handlers
const avatarFileInput = document.getElementById("avatarFileInput");
const avatarEditPreview = document.getElementById("avatarEditPreview");
const editAvatarInput = document.getElementById("editAvatar");

if (editAvatarInput && avatarEditPreview) {
  editAvatarInput.addEventListener("input", () => {
    const val = editAvatarInput.value.trim();
    if (val) {
      avatarEditPreview.src = val;
      avatarEditPreview.style.display = "block";
    } else {
      avatarEditPreview.style.display = "none";
    }
  });
}

if (avatarFileInput) {
  avatarFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast("جاري معالجة وضغط الصورة... ⏳");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & resize image with canvas to max 400x400 for super fast cloud sync
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        editAvatarInput.value = optimizedDataUrl;
        avatarEditPreview.src = optimizedDataUrl;
        avatarEditPreview.style.display = "block";
        showToast("تم اختيار الصورة بنجاح! جاهزة للحفظ في Firebase ✨");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function populateEditorForm() {
  document.getElementById("editName").value = appData.name || "";
  document.getElementById("editTitle").value = appData.title || "";
  document.getElementById("editBio").value = appData.bio || "";
  
  const currentAvatar = appData.avatar || "";
  document.getElementById("editAvatar").value = currentAvatar;
  if (currentAvatar) {
    avatarEditPreview.src = currentAvatar;
    avatarEditPreview.style.display = "block";
  } else {
    avatarEditPreview.style.display = "none";
  }

  document.getElementById("editLocation").value = appData.location || "";
  document.getElementById("editStatus").value = appData.status || "";

  // Social bar items
  const findSocial = (p) => (appData.socialBar || []).find((s) => s.platform === p)?.url || "";
  document.getElementById("editGithub").value = findSocial("github");
  document.getElementById("editLinkedin").value = findSocial("linkedin");
  document.getElementById("editWhatsapp").value = findSocial("whatsapp");
  document.getElementById("editEmail").value = (appData.socialBar || []).find((s) => s.platform === "email")?.url?.replace("mailto:", "") || "";

  // Firebase Config Form
  const savedFb = localStorage.getItem("my_custom_firebase_config");
  let cfg = firebaseConfig;
  if (savedFb) {
    try { cfg = JSON.parse(savedFb); } catch(e){}
  }
  document.getElementById("fbApiKey").value = cfg.apiKey !== "YOUR_API_KEY" ? cfg.apiKey : "";
  document.getElementById("fbProjectId").value = cfg.projectId !== "YOUR_PROJECT_ID" ? cfg.projectId : "";
  document.getElementById("fbAppId").value = cfg.appId !== "YOUR_APP_ID" ? cfg.appId : "";

  renderEditableLinksList();
}

function renderEditableLinksList() {
  editableLinksList.innerHTML = "";
  if (!Array.isArray(appData.links)) appData.links = [];

  appData.links.forEach((link, idx) => {
    const div = document.createElement("div");
    div.className = "editable-link-item";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
        <strong style="font-size: 0.85rem; color: var(--accent-color);">الرابط #${idx + 1}</strong>
        <button type="button" class="btn-secondary remove-link-btn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" data-index="${idx}">
          <i class="fas fa-trash"></i> حذف
        </button>
      </div>
      <input type="text" class="form-input link-edit-title" placeholder="عنوان الرابط (مثال: حسابي على لينكد إن)" value="${link.title || ''}" style="margin-bottom: 0.35rem;" />
      <input type="url" class="form-input link-edit-url" placeholder="الرابط (مثال: https://...)" value="${link.url || ''}" style="margin-bottom: 0.35rem;" />
      <input type="text" class="form-input link-edit-desc" placeholder="وصف قصير اختياري" value="${link.description || ''}" style="margin-bottom: 0.35rem;" />
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" class="form-input link-edit-icon" placeholder="أيقونة (مثال: fab fa-github)" value="${link.icon || 'fas fa-link'}" />
        <input type="text" class="form-input link-edit-badge" placeholder="شارة تمييز (مثال: جديد 🔥)" value="${link.badge || ''}" />
      </div>
    `;
    editableLinksList.appendChild(div);
  });

  // Attach delete handlers
  editableLinksList.querySelectorAll(".remove-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.getAttribute("data-index"), 10);
      appData.links.splice(idx, 1);
      renderEditableLinksList();
    });
  });
}

addNewLinkBtn.addEventListener("click", () => {
  if (!Array.isArray(appData.links)) appData.links = [];
  appData.links.push({
    title: "رابط جديد",
    url: "https://",
    description: "",
    icon: "fas fa-link",
    badge: "",
    highlight: false
  });
  renderEditableLinksList();
});

function openEditorModal() {
  populateEditorForm();
  editorModal.classList.add("active");
}

function closeEditorModalView() {
  editorModal.classList.remove("active");
}

editModalBtn.addEventListener("click", openEditorModal);
quickEditFooterBtn.addEventListener("click", openEditorModal);
closeEditorModal.addEventListener("click", closeEditorModalView);
editorModal.addEventListener("click", (e) => {
  if (e.target === editorModal) closeEditorModalView();
});

/**
 * 9. Save Changes (To LocalStorage & Firebase Firestore)
 */
saveVisualChangesBtn.addEventListener("click", async () => {
  // Save Firebase config if provided
  const fbKey = document.getElementById("fbApiKey").value.trim();
  const fbProj = document.getElementById("fbProjectId").value.trim();
  const fbApp = document.getElementById("fbAppId").value.trim();

  if (fbKey && fbProj) {
    const customFb = {
      apiKey: fbKey,
      authDomain: `${fbProj}.firebaseapp.com`,
      projectId: fbProj,
      storageBucket: `${fbProj}.appspot.com`,
      messagingSenderId: "",
      appId: fbApp || ""
    };
    localStorage.setItem("my_custom_firebase_config", JSON.stringify(customFb));
  }

  // Update Profile Data
  appData.name = document.getElementById("editName").value.trim();
  appData.title = document.getElementById("editTitle").value.trim();
  appData.bio = document.getElementById("editBio").value.trim();
  appData.avatar = document.getElementById("editAvatar").value.trim();
  appData.location = document.getElementById("editLocation").value.trim();
  appData.status = document.getElementById("editStatus").value.trim();

  // Social Bar
  const gh = document.getElementById("editGithub").value.trim();
  const li = document.getElementById("editLinkedin").value.trim();
  const wa = document.getElementById("editWhatsapp").value.trim();
  const em = document.getElementById("editEmail").value.trim();

  appData.socialBar = [
    { platform: "github", url: gh, icon: "fab fa-github", label: "GitHub" },
    { platform: "linkedin", url: li, icon: "fab fa-linkedin-in", label: "LinkedIn" },
    { platform: "whatsapp", url: wa.startsWith("http") ? wa : (wa ? `https://wa.me/${wa.replace(/[^0-9]/g, '')}` : ""), icon: "fab fa-whatsapp", label: "WhatsApp" },
    { platform: "email", url: em ? `mailto:${em}` : "", icon: "fas fa-envelope", label: "Email" }
  ].filter(item => item.url);

  // Harvest edited links
  const linkCards = editableLinksList.querySelectorAll(".editable-link-item");
  const newLinks = [];
  linkCards.forEach((item) => {
    const title = item.querySelector(".link-edit-title").value.trim();
    const url = item.querySelector(".link-edit-url").value.trim();
    const desc = item.querySelector(".link-edit-desc").value.trim();
    const icon = item.querySelector(".link-edit-icon").value.trim();
    const badge = item.querySelector(".link-edit-badge").value.trim();

    if (title || url) {
      newLinks.push({
        title: title || "رابط",
        url: url || "#",
        description: desc,
        icon: icon || "fas fa-link",
        badge: badge,
        highlight: false
      });
    }
  });

  appData.links = newLinks;
  localStorage.setItem("my_personal_bio_data", JSON.stringify(appData));

  // Sync to Firebase if connected
  if (db) {
    try {
      const docRef = doc(db, DB_COLLECTION, DB_DOC_ID);
      await setDoc(docRef, appData);
      showToast("تم الحفظ والمزامنة مع Firebase بنجاح! ☁️✨");
    } catch (err) {
      console.error("Firebase write error:", err);
      showToast("تم الحفظ محلياً (تحقق من أذونات Firestore)");
    }
  } else {
    // Try reinitializing Firebase if credentials were just entered
    await setupFirebase();
    if (db) {
      try {
        const docRef = doc(db, DB_COLLECTION, DB_DOC_ID);
        await setDoc(docRef, appData);
        showToast("تم ربط وحفظ البيانات في Firebase! ☁️🎉");
      } catch (err) {
        showToast("تم حفظ البيانات محلياً! ✨");
      }
    } else {
      showToast("تم حفظ البيانات محلياً بنجاح! ✨");
    }
  }
  
  renderProfile();
  closeEditorModalView();
});

// Test Firebase Connection Button
testFirebaseBtn.addEventListener("click", async () => {
  const fbKey = document.getElementById("fbApiKey").value.trim();
  const fbProj = document.getElementById("fbProjectId").value.trim();
  
  if (!fbKey || !fbProj) {
    showToast("يرجى إدخال API Key و Project ID أولاً");
    return;
  }

  showToast("جاري اختبار الاتصال بـ Firebase... ⏳");
  try {
    const testApp = initializeApp({
      apiKey: fbKey,
      authDomain: `${fbProj}.firebaseapp.com`,
      projectId: fbProj
    }, "testInstance" + Date.now());
    const testDb = getFirestore(testApp);
    const docRef = doc(testDb, DB_COLLECTION, DB_DOC_ID);
    await getDoc(docRef);
    showToast("تم الاتصال بـ Firebase بنجاح! 🟢");
  } catch (e) {
    showToast("نجح الاتصال أو تحقق من إعدادات Firestore Rules");
  }
});

// Export Config
exportConfigBtn.addEventListener("click", () => {
  const configCode = `/**
 * 🛠️ ملف الإعدادات والبيانات الشخصية / Personal Configuration File
 */

const profileData = ${JSON.stringify(appData, null, 2)};

if (typeof window !== "undefined") {
  window.profileData = profileData;
}
`;

  navigator.clipboard.writeText(configCode).then(() => {
    showToast("تم نسخ الكود إلى الحافظة! 💾");
  }).catch(() => {
    showToast("تعذر النسخ");
  });
});

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", async () => {
  initializeData();
  renderProfile();
  initTheme();
  await setupFirebase();
});
