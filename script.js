/* =========================
   HERO CAROUSEL
========================= */

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const slideInterval = 5000;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    const content = slides[index].querySelector('.hero-content');
    if (content) {
        content.style.animation = 'none';
        setTimeout(() => {
            content.style.animation = 'slideUp 0.8s ease-out';
        }, 10);
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, slideInterval);
}

let autoSlide = setInterval(nextSlide, slideInterval);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

/* Pause carousel on hover */
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(autoSlide));
    hero.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, slideInterval);
    });
}

/* =========================
   HAMBURGER MENU
========================= */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Siempre mostrar navbar al abrir menú
        navbar.classList.remove('nav-hidden');
    });
}

/* Close menu on link click */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
    if (
        hamburger &&
        navMenu &&
        !hamburger.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

let lastScrollY = window.pageYOffset;
const SCROLL_OFFSET = 10;

window.addEventListener('scroll', () => {
    if (!navbar) return;

    const currentScrollY = window.pageYOffset;

    // Siempre visible cerca del top
    if (currentScrollY < 80) {
        navbar.classList.remove('nav-hidden');
        lastScrollY = currentScrollY;
        return;
    }

    // Scroll down → hide
    if (currentScrollY > lastScrollY + SCROLL_OFFSET) {
        navbar.classList.add('nav-hidden');
    }
    // Scroll up → show
    else if (currentScrollY < lastScrollY - SCROLL_OFFSET) {
        navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
});

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('.nav-link').forEach(link => {
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

/* =========================
   HERO PARALLAX EFFECT
========================= */

let heroContents = document.querySelectorAll('.hero-content');
let heroSection = document.querySelector('.hero');

function updateParallax() {
    if (!heroContent || !heroSection) return;

    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Solo aplicar el efecto mientras el hero esté visible
    if (scrolled < heroHeight) {
        // Movimiento leve hacia abajo (0.15 es el factor de velocidad)
        const translateY = scrolled * 0.15;
        heroContent.style.transform = `translateY(${translateY}px)`;
    }
}

// Escuchar el evento scroll
window.addEventListener('scroll', updateParallax);

// Inicializar
updateParallax();