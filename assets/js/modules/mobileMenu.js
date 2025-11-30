/**
 * Mobile Menu Module
 * مدیریت منوی موبایل با پشتیبانی کامل از keyboard navigation و accessibility
 */

export function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');

    if (!menuBtn || !navLinks) return;

    let isMenuOpen = false;

    /**
     * باز/بستن منو
     */
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active');
        header?.classList.toggle('menu-open');

        // بروزرسانی ARIA attributes
        menuBtn.setAttribute('aria-expanded', isMenuOpen.toString());
        menuBtn.setAttribute('aria-label', isMenuOpen ? 'بستن منوی موبایل' : 'باز کردن منوی موبایل');

        // تغییر آیکون
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = isMenuOpen ? 'close' : 'menu';
        }

        // مدیریت focus
        if (isMenuOpen) {
            // Focus به اولین لینک منو
            const firstLink = navLinks.querySelector('a');
            firstLink?.focus();

            // افزودن focus trap
            setupFocusTrap();
        } else {
            // حذف focus trap
            removeFocusTrap();
        }
    }

    /**
     * بستن منو
     */
    function closeMenu() {
        if (isMenuOpen) {
            toggleMenu();
            // برگرداندن focus به دکمه منو
            menuBtn.focus();
        }
    }

    /**
     * Focus trap برای keyboard navigation
     */
    function setupFocusTrap() {
        const focusableElements = navLinks.querySelectorAll(
            'a[href], button:not([disabled])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function trapFocus(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement || document.activeElement === menuBtn) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    menuBtn.focus();
                }
            }
        }

        document.addEventListener('keydown', trapFocus);
        navLinks._trapFocusHandler = trapFocus; // ذخیره برای حذف بعدی
    }

    /**
     * حذف focus trap
     */
    function removeFocusTrap() {
        if (navLinks._trapFocusHandler) {
            document.removeEventListener('keydown', navLinks._trapFocusHandler);
            delete navLinks._trapFocusHandler;
        }
    }

    /**
     * مدیریت کلیک روی دکمه
     */
    menuBtn.addEventListener('click', toggleMenu);

    /**
     * مدیریت keyboard: Escape برای بستن منو
     */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    /**
     * بستن منو با کلیک خارج از آن
     */
    document.addEventListener('click', (e) => {
        if (isMenuOpen &&
            !navLinks.contains(e.target) &&
            !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    /**
     * بستن منو هنگام تغییر اندازه صفحه به دسکتاپ
     */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    });
}
