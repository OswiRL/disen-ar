/* =========================
   PAGE TRANSITIONS & SCROLL ANIMATIONS
========================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Load Transition
    document.body.classList.add('page-loaded');

    // 2. Smooth Page Exit
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignore anchors, external links, or hash links on same page
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
                return;
            }

            e.preventDefault();
            document.body.classList.remove('page-loaded');

            setTimeout(() => {
                window.location.href = href;
            }, 200); // Faster transition (0.2s)
        });
    });

    // 3. Scroll Reveal Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Auto-add .reveal class to ALL content elements across all sections
    // We target inner content so backgrounds remain static
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .section-title, .section-main-title, ' +
        '.bento-grid, .bento-card, ' +
        '.service-list, .service-item, .service-area-title, ' +
        '.mission-content, .mission-badge, .mission-title, .testimonial, ' +
        '.about-content, .about-title, .about-description, ' +
        '.team-grid, .team-member, .team-title, ' +
        '.values-grid, .value-card, .values-title, ' +
        '.services-grid, .service-card, ' +
        '.contact-grid, .contact-info, .contact-form, .contact-title, ' +
        '.map-container, .map-title, .map-placeholder, ' +
        '.stacked-container, .stack-card, ' +
        '.footer-content, .footer-left, .footer-right, ' +
        '.logo-carousel, .video-about, ' +
        '.hero-about-container, .hero-about-badge, .hero-about-title, ' +
        '.video-about-main, .video-about-thumbnail, ' +
        '.mission-vision-container, .mission-vision-grid, .first-text-about, .second-text-about, ' +
        '.flip-card, .mission-about, .vision-about, ' +
        '.values-text, .scrolling-values, .scrolling-text, .years-text'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});
