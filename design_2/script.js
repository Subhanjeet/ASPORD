// Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function () {
            loader.classList.add('fade-out');
        }, 3500); // 3.5 seconds delay
    }
});

// Mouse Trail Logic
document.addEventListener('DOMContentLoaded', function () {
    // Check for reduced motion or mobile (touch)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

    if (prefersReducedMotion || isMobile) return; // Disable on mobile/reduced motion

    // dynamically create trail container if it doesn't exist
    if (!document.getElementById('trail-container')) {
        const container = document.createElement('div');
        container.id = 'trail-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    const container = document.getElementById("trail-container");
    const DOT_COUNT = 20;
    const SMOOTHING = 0.25;

    let mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    let dots = [];

    // Create dots
    // Robust check: Look for the contact form element instead of relying on URL
    const isContactPage = document.querySelector('.contact-form') !== null;

    for (let i = 0; i < DOT_COUNT; i++) {
        const dot = document.createElement("div");
        dot.classList.add("trail-dot");
        if (isContactPage) {
            dot.classList.add("contact-trail"); // Add specific class for contact page
        }
        container.appendChild(dot);
        dots.push({
            el: dot,
            x: mouse.x,
            y: mouse.y
        });
    }

    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        let x = mouse.x;
        let y = mouse.y;

        dots.forEach((dot, index) => {
            dot.x += (x - dot.x) * SMOOTHING;
            dot.y += (y - dot.y) * SMOOTHING;

            dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`;

            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(animate);
    }

    animate();
});

// Footer Logic
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const footerContainer = document.querySelector(".footer-container.fade-in");
    if (footerContainer) {
        setTimeout(() => footerContainer.classList.add("show"), 100);
    }
});

// Newsletter Subscription
function connect() {
    const emailInput = document.getElementById("email");
    const message = document.getElementById("message");
    const email = emailInput.value;

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (email.match(pattern)) {
        message.style.color = "var(--accent-red)";
        message.textContent = "Successfully Subscribed!";
        emailInput.value = "";
    } else {
        message.style.color = "#ff6b6b";
        message.textContent = "Please enter a valid email.";
    }
}



// Rotating Text Logic
document.addEventListener('DOMContentLoaded', function () {
    const texts = document.querySelectorAll(".rotating span");
    if (texts.length === 0) return;

    let index = 0;

    // Check for reduced motion to stop rotation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setInterval(() => {
        texts[index].classList.remove("active");
        texts[index].classList.add("exit");
        index = (index + 1) % texts.length;
        texts[index].classList.add("active");

        setTimeout(() => {
            texts.forEach(t => {
                if (!t.classList.contains("active")) t.classList.remove("exit");
            });
        }, 600);
    }, 2000);
});

/* =========================================
   PIXEL CARD ANIMATION (Vanilla Adaptation)
   ========================================= */
class Pixel {
    constructor(canvas, context, x, y, color, speed, delay) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = this.getRandomValue(0.1, 0.9) * speed;
        this.size = 0;
        this.sizeStep = Math.random() * 0.4;
        this.minSize = 0.5;
        this.maxSizeInteger = 2;
        this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
        this.delay = delay;
        this.counter = 0;
        this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
        this.isIdle = false;
        this.isReverse = false;
        this.isShimmer = false;
    }

    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }

    draw() {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
    }

    appear() {
        this.isIdle = false;
        if (this.counter <= this.delay) {
            this.counter += this.counterStep;
            return;
        }
        if (this.size >= this.maxSize) {
            this.isShimmer = true;
        }
        if (this.isShimmer) {
            this.shimmer();
        } else {
            this.size += this.sizeStep;
        }
        this.draw();
    }

    disappear() {
        this.isShimmer = false;
        this.counter = 0;
        if (this.size <= 0) {
            this.isIdle = true;
            return;
        } else {
            this.size -= 0.1;
        }
        this.draw();
    }

    shimmer() {
        if (this.size >= this.maxSize) {
            this.isReverse = true;
        } else if (this.size <= this.minSize) {
            this.isReverse = false;
        }
        if (this.isReverse) {
            this.size -= this.speed;
        } else {
            this.size += this.speed;
        }
    }
}

class PixelCard {
    constructor(cardFn) {
        this.card = cardFn;
        this.canvas = cardFn.querySelector('.pixel-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.pixels = [];
        this.animationRequest = null;
        this.timePrevious = performance.now();

        // Strict Checks: Reduced Motion OR Mobile/Touch
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(max-width: 768px)').matches ||
            'ontouchstart' in window;

        // Configuration matching the theme
        this.gap = 5;
        this.speed = 35;
        this.colors = ['#FF1E1E', '#C40000', '#222222', '#111111'];

        // IF reduced motion/mobile, DO NOT INIT CANVAS LOOP
        if (this.reducedMotion) return;

        this.init();
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this.card);

        // Bind events
        this.card.addEventListener('mouseenter', () => this.handleAnimation('appear'));
        this.card.addEventListener('mouseleave', () => this.handleAnimation('disappear'));
    }

    getEffectiveSpeed(value) {
        return value * 0.001;
    }

    init() {
        const rect = this.card.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.pixels = [];
        for (let x = 0; x < width; x += this.gap) {
            for (let y = 0; y < height; y += this.gap) {
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];

                const dx = x - width / 2;
                const dy = y - height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delay = distance; // No reduced motion logic needed here as we exit early

                this.pixels.push(new Pixel(
                    this.canvas,
                    this.ctx,
                    x,
                    y,
                    color,
                    this.getEffectiveSpeed(this.speed),
                    delay
                ));
            }
        }
    }

    animate(fnName) {
        this.animationRequest = requestAnimationFrame(() => this.animate(fnName));
        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;
        const timeInterval = 1000 / 60; // 60 FPS

        if (timePassed < timeInterval) return;
        this.timePrevious = timeNow - (timePassed % timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let allIdle = true;
        for (let i = 0; i < this.pixels.length; i++) {
            const pixel = this.pixels[i];
            pixel[fnName]();
            if (!pixel.isIdle) {
                allIdle = false;
            }
        }
        if (allIdle) {
            cancelAnimationFrame(this.animationRequest);
        }
    }

    handleAnimation(name) {
        cancelAnimationFrame(this.animationRequest);
        this.animationRequest = requestAnimationFrame(() => this.animate(name));
    }
}

// Initialize Pixel Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => new PixelCard(card));
});
