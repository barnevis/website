import { TypeWriter } from './modules/typewriter.js';
import { initMobileMenu } from './modules/mobileMenu.js';

// --- Main function to run when the page is ready ---
function main() {
    // Initialize mobile menu on all pages
    initMobileMenu();

    // Initialize typewriter effect only on the home page
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        initTypewriterEffect(heroSection);
    }
    
    // You can add other initializations here
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
        document.querySelector('.hero-slogan')?.classList.add('fade-in');
        document.querySelector('.hero-ai-badge')?.classList.add('fade-in');
        document.querySelector('.hero-buttons')?.classList.add('fade-in');
    }, 200);
}

// --- Run the main function ---
document.addEventListener('DOMContentLoaded', main);
