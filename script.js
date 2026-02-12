// Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function () {
            loader.classList.add('fade-out');
        }, 3500); // 3.5 seconds delay
    }
});

// Mouse Trail Logic (Runs on all pages)
document.addEventListener('DOMContentLoaded', function () {
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

    for (let i = 0; i < DOT_COUNT; i++) {
        const dot = document.createElement("div");
        dot.classList.add("trail-dot");
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

        dots.forEach((dot) => {
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
    // Update Year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Fade in footer
    const footerContainer = document.querySelector(".footer-container.fade-in");
    if (footerContainer) {
        // Simple delay to ensure it fades in after load
        setTimeout(() => {
            footerContainer.classList.add("show");
        }, 100);
    }
});

// Newsletter Subscription
function connect() {
    const emailInput = document.getElementById("email");
    const message = document.getElementById("message");
    const email = emailInput.value;

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (email.match(pattern)) {
        message.style.color = "var(--accent-color)";
        message.textContent = "Successfully Subscribed!";
        emailInput.value = ""; // Clear input
    } else {
        message.style.color = "#ff6b6b"; // Red-ish color for error
        message.textContent = "Please enter a valid email.";
    }
}
