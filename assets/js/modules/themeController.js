/**
 * Theme Controller Module
 * مدیریت تم سایت (روشن/تاریک)
 */

const THEME_KEY = 'barnevis-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * تشخیص تنظیمات سیستم کاربر
 */
function detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK;
    }
    return THEME_LIGHT;
}

/**
 * دریافت تم ذخیره شده از localStorage
 */
function loadPreference() {
    return localStorage.getItem(THEME_KEY);
}

/**
 * ذخیره تم در localStorage
 */
function savePreference(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * دریافت تم فعلی
 */
export function getTheme() {
    return document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
}

/**
 * اعمال تم به صفحه
 */
export function setTheme(theme, save = true) {
    // اعتبارسنجی ورودی
    if (theme !== THEME_LIGHT && theme !== THEME_DARK) {
        console.warn(`Invalid theme: ${theme}. Using light theme.`);
        theme = THEME_LIGHT;
    }

    // اعمال تم
    document.documentElement.setAttribute('data-theme', theme);

    // به‌روزرسانی meta theme-color برای مرورگر موبایل
    updateMetaThemeColor(theme);

    // ذخیره در localStorage
    if (save) {
        savePreference(theme);
    }

    // ارسال رویداد سفارشی
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * تغییر بین تم روشن و تاریک
 */
export function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    setTheme(newTheme);
    return newTheme;
}

/**
 * به‌روزرسانی رنگ theme در meta tag
 */
function updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }

    // رنگ‌های مناسب برای هر تم
    const colors = {
        light: '#f9fafb',
        dark: '#09090b'
    };

    metaThemeColor.content = colors[theme];
}

/**
 * رصد تغییرات تنظیمات سیستم
 */
function watchSystemPreference() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // فقط اگر کاربر تنظیمات دستی نداشته باشد
    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = loadPreference();
        if (!savedTheme) {
            const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
            setTheme(newTheme, false);
        }
    });
}

/**
 * راه‌اندازی اولیه
 */
function initializeTheme() {
    // ترتیب اولویت: localStorage > تنظیمات سیستم > پیش‌فرض (روشن)
    const savedTheme = loadPreference();
    const systemTheme = detectSystemPreference();
    const initialTheme = savedTheme || systemTheme;

    // اعمال تم بدون ذخیره (چون قبلاً ذخیره شده یا از سیستم است)
    setTheme(initialTheme, savedTheme ? false : true);
}

/**
 * اتصال event listener به دکمه toggle
 */
function attachToggleButton() {
    const toggleButton = document.getElementById('theme-toggle');

    if (!toggleButton) {
        console.warn('Theme toggle button not found');
        return;
    }

    toggleButton.addEventListener('click', () => {
        const newTheme = toggleTheme();

        // افکت ریپل (اختیاری)
        createRippleEffect(toggleButton);

        // لاگ برای دیباگ
        console.log(`Theme changed to: ${newTheme}`);
    });

    // کلید میانبر: Ctrl/Cmd + Shift + D
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

/**
 * ایجاد افکت ریپل روی دکمه
 */
function createRippleEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

/**
 * تابع برای اعمال تم اولیه (قبل از بارگذاری HTML)
 */
export function initThemeEarly() {
    try {
        // اعمال تم اولیه در سریع‌ترین زمان ممکن
        initializeTheme();

        // رصد تغییرات سیستم
        watchSystemPreference();

        console.log('Theme applied early (before HTML injection)');
    } catch (error) {
        console.error('Error in early theme initialization:', error);
    }
}

/**
 * تابع اصلی برای راه‌اندازی کامل سیستم تم (بعد از بارگذاری HTML)
 */
export function initThemeController() {
    try {
        // اتصال event listeners به دکمه toggle
        attachToggleButton();

        console.log('Theme controller fully initialized');
    } catch (error) {
        console.error('Error initializing theme controller:', error);
    }
}

// اجرای سریع برای جلوگیری از فلش تم
// این خط تضمین می‌کند که تم قبل از رندر کامل صفحه اعمال شود
if (document.readyState === 'loading') {
    initializeTheme();
} else {
    initializeTheme();
}
