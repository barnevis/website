import { TypeWriter } from './modules/typewriter.js';
import { initMobileMenu } from './modules/mobileMenu.js';
import { injectHTML } from './modules/htmlInjector.js';
import { setActiveNavLink } from './modules/navActive.js';
import { setupGlobalErrorHandler, showError } from './modules/errorHandler.js';
import { initThemeController, initThemeEarly } from './modules/themeController.js';

// راه‌اندازی global error handler
setupGlobalErrorHandler();

// --- Main function to run when the page is ready ---
async function main() {
    try {
        // اعمال تم قبل از بارگذاری محتوا (جلوگیری از فلش)
        initThemeEarly();

        // بارگذاری HTML (شامل header با دکمه theme toggle)
        await injectHTML();

        // حالا که header بارگذاری شده، دکمه toggle را متصل می‌کنیم
        initThemeController();

        setActiveNavLink();
        initMobileMenu();
        initGlowCards();

        // Initialize typewriter effect only on the home page
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            initTypewriterEffect(heroSection);
        }
    } catch (error) {
        console.error('Error in main():', error);
        showError('خطایی در بارگذاری صفحه رخ داده است. لطفاً صفحه را مجدد بارگذاری کنید.', error);
    }
}

// --- Typewriter Effect Functionality ---
function initTypewriterEffect(heroSection) {
    const typewriterElements = document.querySelectorAll('.typewriter-text');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypewriterAnimation(typewriterElements);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(heroSection);
}

async function startTypewriterAnimation(elements) {
    elements.forEach(el => {
        el.textContent = '';
    });

    // Start typing the first text
    if (elements[0]) {
        const text1 = elements[0].getAttribute('data-text');
        const writer1 = new TypeWriter(elements[0], text1, 50, 800); // Increased delay
        await writer1.start();
    }

    // Start typing the second text
    if (elements[1]) {
        const text2 = elements[1].getAttribute('data-text');
        const writer2 = new TypeWriter(elements[1], text2, 30, 300);
        await writer2.start();
    }

    // Fade in buttons and badge after typing
    setTimeout(() => {
        document.querySelector('.hero-ai-badge')?.classList.add('fade-in');
        document.querySelector('.hero-buttons')?.classList.add('fade-in');
    }, 200);
}


function initGlowCards() {
    const cards = document.querySelectorAll('.compact-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

// --- Run the main function ---
document.addEventListener('DOMContentLoaded', main);