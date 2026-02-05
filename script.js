/* =========================
   HERO CAROUSEL
========================= */

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const slideInterval = 5000;
let autoSlideInterval = null;
let isHovering = false;

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, slideInterval);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function showSlide(index) {
    if (!slides.length) return;

    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    const slide = slides[index];
    const indicator = indicators[index];

    if (slide) {
        slide.classList.add('active');
    }
    if (indicator) {
        indicator.classList.add('active');
    }
}

function nextSlide() {
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = index;
    showSlide(currentSlide);
    
    // Reset timer on manual interaction
    stopAutoSlide();
    if (!isHovering) {
        startAutoSlide();
    }
}

// Initialize
if (slides.length > 1) {
    startAutoSlide();
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

/* Pause carousel on hover */
const hero = document.querySelector('.hero');
if (hero && slides.length > 1) {
    hero.addEventListener('mouseenter', () => {
        isHovering = true;
        stopAutoSlide();
    });
    hero.addEventListener('mouseleave', () => {
        isHovering = false;
        startAutoSlide();
    });
}

/* =========================
   HAMBURGER MENU
========================= */

let isMenuOpen = false; // Track menu state

function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update menu state
            isMenuOpen = hamburger.classList.contains('active');

            // Always show navbar when opening menu
            const navbar = document.querySelector('.navbar');
            if (navbar && isMenuOpen) {
                navbar.classList.remove('nav-hidden');
            }
        });
    }
}

function bindNavLinkScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.navBound === 'true') {
            return;
        }
        link.dataset.navBound = 'true';
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function initializeNavInteractions() {
    initializeHamburgerMenu();
    bindNavLinkScroll();
}

// Initialize nav interactions when navbar is injected
document.addEventListener('navbar:loaded', initializeNavInteractions);

/* Close menu on link click */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
        }
    }
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (
        hamburger &&
        navMenu &&
        !hamburger.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        isMenuOpen = false;
    }
});


/* =========================
   SMOOTH SCROLL
========================= */
/* =========================
   HERO PARALLAX EFFECT
========================= */

const allHeroContents = document.querySelectorAll('.hero-content'); // Select all
let heroSection = document.querySelector('.hero');

function updateParallax() {
    if (!allHeroContents.length || !heroSection) return;

    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Only apply effect while hero is visible
    if (scrolled < heroHeight) {
        const translateY = scrolled * 0.15;
        // Apply to ALL hero content elements
        allHeroContents.forEach(content => {
            content.style.transform = `translateY(${translateY}px)`;
        });
    }
}

window.addEventListener('scroll', updateParallax);
updateParallax();

/* =========================
   HIDE/SHOW NAVBAR ON SCROLL
========================= */

let lastScrollTop = 0;
const scrollThreshold = 100; // Increased threshold

function handleNavbarVisibility() {
    const navbarElement = document.querySelector('.navbar');
    if (!navbarElement) {
        setTimeout(handleNavbarVisibility, 50);
        return;
    }

    // Don't hide navbar if menu is open
    if (isMenuOpen) {
        return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Don't hide navbar at the top of the page
    if (currentScrollTop <= 100) {
        navbarElement.classList.remove('nav-hidden');
        lastScrollTop = currentScrollTop;
        return;
    }

    // Need a minimum scroll distance to trigger hide/show
    const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
    
    if (scrollDifference < 5) {
        // Ignore very small scroll movements
        return;
    }

    // Scrolling down - hide navbar
    if (currentScrollTop > lastScrollTop) {
        navbarElement.classList.add('nav-hidden');
    } 
    // Scrolling up - show navbar
    else {
        navbarElement.classList.remove('nav-hidden');
    }

    lastScrollTop = currentScrollTop;
}

// Throttle scroll events
let scrollTimer;
function throttledScrollHandler() {
    if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
            handleNavbarVisibility();
            scrollTimer = null;
        }, 50); // Better balance between performance and responsiveness
    }
}

window.addEventListener('scroll', throttledScrollHandler, { passive: true });

// Initialize
setTimeout(() => {
    handleNavbarVisibility();
}, 100);

/* =========================
   VIDEO PLAY FUNCTION
========================= */

function playVideo() {
    const video = document.querySelector('.video-about-video');
    const playButton = document.querySelector('.video-about-play-button');

    if (video && playButton) {
        video.classList.add('active');
        playButton.style.display = 'none';
        video.play();
    }
}

/* =========================
   SERVICE AREA TOGGLE (MOBILE)
========================= */

function initializeServiceAreaToggle() {
    const items = document.querySelectorAll('.service-item');
    if (!items.length) return;

    const mq = window.matchMedia('(max-width: 768px)');

    items.forEach(item => {
        if (item.dataset.serviceBound === 'true') {
            return;
        }
        item.dataset.serviceBound = 'true';
        item.addEventListener('click', () => {
            if (!mq.matches) {
                return;
            }
            const wasOpen = item.classList.contains('is-open');
            items.forEach(other => other.classList.remove('is-open'));
            if (!wasOpen) {
                item.classList.add('is-open');
            }
        });
    });

    mq.addEventListener('change', () => {
        if (!mq.matches) {
            items.forEach(item => item.classList.remove('is-open'));
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeServiceAreaToggle);
