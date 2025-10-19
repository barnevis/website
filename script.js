// Simplified Typewriter Effect Script
class TypeWriter {
    constructor(element, text, speed = 50, delay = 0) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.delay = delay;
        this.currentIndex = 0;
    }

    start() {
        return new Promise((resolve) => {
            // Initial delay before starting
            setTimeout(() => {
                this.type(resolve);
            }, this.delay);
        });
    }

    type(callback) {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(callback), this.speed);
        } else {
            if (callback) callback();
        }
    }
}

// Initialize typewriter effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    // Check if we're in the hero section view
    const heroSection = document.querySelector('.hero-section');
    
    // Create an Intersection Observer to trigger animation when hero is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start typewriter effect
                startTypewriterAnimation();
                // Stop observing after animation starts
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of hero section is visible
    });

    // Function to start the animation sequence
    async function startTypewriterAnimation() {
        // Hide all text initially
        typewriterElements.forEach(el => {
            el.textContent = '';
        });

        // Start typing the first text
        if (typewriterElements[0]) {
            const text1 = typewriterElements[0].getAttribute('data-text');
            const writer1 = new TypeWriter(typewriterElements[0], text1, 50, 200);
            await writer1.start();
        }

        // Start typing the second text after a small delay
        if (typewriterElements[1]) {
            const text2 = typewriterElements[1].getAttribute('data-text');
            const writer2 = new TypeWriter(typewriterElements[1], text2, 30, 300);
            await writer2.start();
        }

        // Show buttons and badge with fade-in effect after typing
        setTimeout(() => {
            document.querySelector('.hero-ai-badge').classList.add('fade-in');
            document.querySelector('.hero-buttons').classList.add('fade-in');
        }, 200);
    }

    // Start observing the hero section
    if (heroSection) {
        observer.observe(heroSection);
    }

    // Fallback: If Intersection Observer is not supported, start immediately
    if (!window.IntersectionObserver) {
        startTypewriterAnimation();
    }
});