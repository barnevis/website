/**
 * Error Handler Module
 * مدیریت مرکزی خطاها و نمایش نوتیفیکیشن‌ها به کاربر
 */

// انواع پیام‌ها
export const NotificationType = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SUCCESS: 'success'
};

/**
 * نمایش نوتیفیکیشن به کاربر
 * @param {string} message - متن پیام
 * @param {string} type - نوع پیام (error, warning, info, success)
 * @param {number} duration - مدت زمان نمایش به میلی‌ثانیه (0 = بدون بسته شدن خودکار)
 */
export function showNotification(message, type = NotificationType.INFO, duration = 5000) {
    // ایجاد container در صورت عدم وجود
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // ایجاد نوتیفیکیشن
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // آیکون مناسب برای هر نوع
    const icons = {
        error: 'error',
        warning: 'warning',
        info: 'info',
        success: 'check_circle'
    };

    notification.innerHTML = `
        <span class="material-symbols-outlined notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="بستن">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;

    // افزودن به container
    container.appendChild(notification);

    // انیمیشن ورود
    setTimeout(() => notification.classList.add('notification-show'), 10);

    // دکمه بستن
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => dismissNotification(notification));

    // بسته شدن خودکار
    if (duration > 0) {
        setTimeout(() => dismissNotification(notification), duration);
    }

    return notification;
}

/**
 * بستن یک نوتیفیکیشن خاص
 * @param {HTMLElement} notification - المنت نوتیفیکیشن
 */
export function dismissNotification(notification) {
    if (!notification) return;
    
    notification.classList.remove('notification-show');
    notification.classList.add('notification-hide');
    
    // حذف از DOM بعد از انیمیشن
    setTimeout(() => {
        notification.remove();
        
        // حذف container اگر خالی شد
        const container = document.getElementById('notification-container');
        if (container && container.children.length === 0) {
            container.remove();
        }
    }, 300);
}

/**
 * نمایش پیام خطا به کاربر
 * @param {string} message - متن خطا
 * @param {Error} error - آبجکت خطا (برای لاگ در console)
 */
export function showError(message, error = null) {
    if (error) {
        console.error('Error:', error);
    }
    return showNotification(message, NotificationType.ERROR, 7000);
}

/**
 * نمایش پیام هشدار
 * @param {string} message - متن هشدار
 */
export function showWarning(message) {
    return showNotification(message, NotificationType.WARNING, 5000);
}

/**
 * نمایش پیام اطلاعاتی
 * @param {string} message - متن پیام
 */
export function showInfo(message) {
    return showNotification(message, NotificationType.INFO, 4000);
}

/**
 * نمایش پیام موفقیت
 * @param {string} message - متن پیام
 */
export function showSuccess(message) {
    return showNotification(message, NotificationType.SUCCESS, 4000);
}

/**
 * مدیریت خطاهای عمومی برنامه
 */
export function setupGlobalErrorHandler() {
    // مدیریت خطاهای JavaScript
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        showError('خطایی در بارگذاری صفحه رخ داده است. لطفاً صفحه را مجدد بارگذاری کنید.');
    });

    // مدیریت خطاهای Promise
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showError('خطایی در پردازش اطلاعات رخ داده است.');
    });
}
