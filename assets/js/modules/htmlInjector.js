import { showError, showWarning } from './errorHandler.js';

/**
 * دریافت محتوای HTML از یک فایل
 * @param {string} filePath - مسیر فایل
 * @param {number} retries - تعداد تلاش‌های مجدد
 * @returns {Promise<string>} محتوای HTML
 */
async function fetchHTML(filePath, retries = 2) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching ${filePath}:`, error);

        // تلاش مجدد
        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // صبر 1 ثانیه
            return fetchHTML(filePath, retries - 1);
        }

        // بعد از تمام تلاش‌ها
        showError(`خطا در بارگذاری ${filePath}. لطفاً اتصال اینترنت خود را بررسی کنید.`, error);
        return null;
    }
}

/**
 * تزریق محتوای HTML به placeholderها
 */
export async function injectHTML() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    let hasError = false;

    // بارگذاری header
    if (headerPlaceholder) {
        const headerHTML = await fetchHTML('components/_header.html');
        if (headerHTML) {
            headerPlaceholder.innerHTML = headerHTML;
        } else {
            hasError = true;
            headerPlaceholder.innerHTML = `
                <div class="error-placeholder">
                    <p>خطا در بارگذاری منو</p>
                </div>
            `;
        }
    }

    // بارگذاری footer
    if (footerPlaceholder) {
        const footerHTML = await fetchHTML('components/_footer.html');
        if (footerHTML) {
            footerPlaceholder.innerHTML = footerHTML;
        } else {
            hasError = true;
            footerPlaceholder.innerHTML = `
                <div class="error-placeholder">
                    <p>خطا در بارگذاری فوتر</p>
                </div>
            `;
        }
    }

    // هشدار کلی در صورت بروز خطا
    if (hasError) {
        showWarning('مشکلی در بارگذاری برخی بخش‌ها وجود دارد. لطفاً صفحه را مجدد بارگذاری کنید.');
    }
}

