/* =========================
   HERO CAROUSEL
========================= */

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const slideInterval = 5000;
let autoSlide = null;

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

    const content = slide ? slide.querySelector('.hero-content') : null;
    if (content) {
        content.style.animation = 'none';
        setTimeout(() => {
            content.style.animation = 'slideUp 0.8s ease-out';
        }, 10);
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
    if (autoSlide) {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, slideInterval);
    }
}

if (slides.length > 1) {
    autoSlide = setInterval(nextSlide, slideInterval);
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

/* Pause carousel on hover */
const hero = document.querySelector('.hero');
if (hero && slides.length > 1) {
    hero.addEventListener('mouseenter', () => clearInterval(autoSlide));
    hero.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, slideInterval);
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
// Bound after navbar is injected

/* =========================
   HERO PARALLAX EFFECT
========================= */

let heroContent = document.querySelector('.hero-content'); // Fixed: singular
let heroSection = document.querySelector('.hero');

function updateParallax() {
    if (!heroContent || !heroSection) return;

    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Only apply effect while hero is visible
    if (scrolled < heroHeight) {
        const translateY = scrolled * 0.15;
        heroContent.style.transform = `translateY(${translateY}px)`;
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
