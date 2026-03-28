// ===== Theme Toggle =====
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('agripulse-theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-btn');
    if (btn) {
        btn.innerHTML = theme === 'dark'
            ? '<i class="ph ph-sun"></i>'
            : '<i class="ph ph-moon"></i>';
    }
}

// Load saved theme
(function () {
    const saved = localStorage.getItem('agripulse-theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeIcon(saved);
    }
})();

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Nav Toggle =====
function toggleNav() {
    const links = document.getElementById('nav-links');
    links.classList.toggle('active');
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-links').classList.remove('active');
    });
});

// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.style.getPropertyValue('--delay') || '0s';
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===== Counter Animation for Stats =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target >= 1000) {
                counter.textContent = current.toLocaleString('en-IN') + '+';
            } else {
                counter.textContent = current + (target === 95 ? '%' : '+');
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// Trigger counter when stats section is visible
const statsSection = document.getElementById('stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
}

// ===== Active Nav Link Highlight =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--primary)';
        }
    });
});

// ===== Smooth Scroll for All Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Hero Image Slideshow & Floating Data Rotation =====
(function () {
    const heroImg = document.getElementById('hero-slideshow-img');
    if (!heroImg) return;

    // Slideshow images
    const slides = [
        'hero_bg.png',
        'farming_rice_paddy.png',
        'farming_wheat_harvest.png',
        'farming_vegetables.png',
        'farming_drone_tech.png'
    ];

    // Floating data sets — one per slide
    const floatData = [
        {
            card1: { icon: 'ph-fill ph-plant', title: 'Crop Health', value: 'Optimal ✓', color: 'hsl(150,78%,40%)' },
            card2: { icon: 'ph-fill ph-drop', title: 'Soil Moisture', value: '48% Good', color: 'hsl(210,90%,55%)' },
            card3: { icon: 'ph-fill ph-sun', title: 'Weather AI', value: 'Clear Skies', color: 'hsl(35,92%,55%)' }
        },
        {
            card1: { icon: 'ph-fill ph-grain', title: 'Rice Yield', value: '5.2 T/ha', color: 'hsl(120,60%,40%)' },
            card2: { icon: 'ph-fill ph-thermometer', title: 'Temperature', value: '28°C Warm', color: 'hsl(15,85%,55%)' },
            card3: { icon: 'ph-fill ph-cloud-rain', title: 'Rainfall', value: '120mm/mo', color: 'hsl(200,80%,50%)' }
        },
        {
            card1: { icon: 'ph-fill ph-wheat', title: 'Wheat Quality', value: 'Grade A+', color: 'hsl(45,90%,45%)' },
            card2: { icon: 'ph-fill ph-chart-line-up', title: 'Market Price', value: '₹2,450/Q', color: 'hsl(150,78%,40%)' },
            card3: { icon: 'ph-fill ph-wind', title: 'Wind Speed', value: '12 km/h', color: 'hsl(210,70%,55%)' }
        },
        {
            card1: { icon: 'ph-fill ph-leaf', title: 'Organic Score', value: '98% Pure', color: 'hsl(130,65%,42%)' },
            card2: { icon: 'ph-fill ph-drop-half-bottom', title: 'Irrigation', value: 'Drip Active', color: 'hsl(195,85%,48%)' },
            card3: { icon: 'ph-fill ph-bug', title: 'Pest Alert', value: 'No Threats', color: 'hsl(150,78%,40%)' }
        },
        {
            card1: { icon: 'ph-fill ph-drone', title: 'Drone Scan', value: '92% Done', color: 'hsl(260,60%,55%)' },
            card2: { icon: 'ph-fill ph-wifi-high', title: 'IoT Sensors', value: '24 Active', color: 'hsl(180,60%,45%)' },
            card3: { icon: 'ph-fill ph-chart-bar', title: 'Growth Rate', value: '+18% ↑', color: 'hsl(150,78%,40%)' }
        }
    ];

    let currentSlide = 0;
    const INTERVAL = 25000; // 25 seconds

    function updateFloatCard(cardNum, data) {
        const title = document.getElementById('float-title-' + cardNum);
        const value = document.getElementById('float-value-' + cardNum);
        const icon = document.getElementById('float-icon-' + cardNum);
        const card = document.getElementById('float-card-' + cardNum);

        if (!title || !value || !icon || !card) return;

        // Fade out card
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            title.textContent = data.title;
            value.textContent = data.value;
            value.style.color = data.color;
            icon.className = data.icon;
            icon.parentElement.style.color = data.color;
            icon.parentElement.style.background = data.color.replace(')', ',0.15)').replace('hsl', 'hsla');

            // Fade in card
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 400);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        const data = floatData[currentSlide];

        // Crossfade image
        heroImg.style.opacity = '0';
        heroImg.style.transform = 'scale(1.05)';

        setTimeout(() => {
            heroImg.src = slides[currentSlide];
            heroImg.style.opacity = '1';
            heroImg.style.transform = 'scale(1)';
        }, 600);

        // Update floating cards with staggered delay
        updateFloatCard(1, data.card1);
        setTimeout(() => updateFloatCard(2, data.card2), 200);
        setTimeout(() => updateFloatCard(3, data.card3), 400);
    }

    // Add CSS transitions to hero img and float cards
    heroImg.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById('float-card-' + i);
        if (card) card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }

    // Preload all images
    slides.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Start the slideshow
    setInterval(nextSlide, INTERVAL);
})();
