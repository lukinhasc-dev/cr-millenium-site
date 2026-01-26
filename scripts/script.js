// CR MILLENIUM - Advanced Interactive Features with Improved Carousel

// === HEADER SCROLL EFFECT ===
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// === MOBILE MENU ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// === ENHANCED SMOOTH SCROLL WITH ANIMATION ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const mainNav = document.getElementById('mainNav');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});

// === BACK TO TOP BUTTON ===
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Respect data-delay attribute for staggered animations
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            } else {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeInElements = document.querySelectorAll('.fade-in-element');
fadeInElements.forEach(element => {
    fadeInObserver.observe(element);
});

// === ANIMATED COUNTERS FOR STATS ===
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.includes('+') ? '+' : (element.textContent.includes('%') ? '%' : '');
    const isTime = element.textContent.includes('h');

    if (isTime) {
        element.textContent = target + 'h';
        return;
    }

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            const value = Math.floor(start);
            element.textContent = value + suffix;
        }
    }, 16);
};

// Observe stat numbers for animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            animateCounter(entry.target, number);
        }
    });
}, { threshold: 0.5 });

const statNumbers = document.querySelectorAll('.stat-number, .stat-value');
statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// === IMPROVED CLIENTS CAROUSEL ===
class ClientsCarousel {
    constructor() {
        this.carousel = document.getElementById('clientsCarousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');

        if (!this.carousel) return;

        this.slides = Array.from(this.carousel.querySelectorAll('.client-slide'));
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
        this.isAnimating = false;

        this.init();
    }

    getSlidesToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 4;
    }

    init() {
        if (this.slides.length === 0) return;

        this.createDots();
        this.updateCarousel(false);
        this.attachEvents();

        // Auto-play
        this.startAutoPlay();
    }

    createDots() {
        const numberOfDots = this.maxIndex + 1;
        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoPlay();
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    updateCarousel(animate = true) {
        if (this.isAnimating && animate) return;

        if (animate) {
            this.isAnimating = true;
        }

        const slideWidth = this.slides[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(this.carousel).gap) || 0;
        const offset = -this.currentIndex * (slideWidth + gap);

        this.carousel.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
        }

        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        }
    }

    goToSlide(index) {
        if (this.isAnimating) return;
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel(true);
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel(true);
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex;
        }
        this.updateCarousel(true);
    }

    attachEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }

        // Responsive resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldSlidesToShow = this.slidesToShow;
                this.slidesToShow = this.getSlidesToShow();

                if (oldSlidesToShow !== this.slidesToShow) {
                    this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
                    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);

                    // Recreate dots
                    this.dotsContainer.innerHTML = '';
                    this.createDots();

                    this.updateCarousel(false);
                }
            }, 250);
        });

        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
                this.resetAutoPlay();
            }
        });

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 4000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlayInterval = null;
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
if (document.getElementById('clientsCarousel')) {
    new ClientsCarousel();
}

// === FORM SUBMISSION ===
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Here you would normally send the data to a server
        console.log('Form submitted:', data);

        // Show success message
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');

        // Reset form
        contactForm.reset();
    });
}

// === ACTIVE NAV LINK ===
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// === FLOATING PARTICLES IN HERO ===
const createParticles = () => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const numberOfParticles = 20;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(220, 38, 38, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';

        particlesContainer.appendChild(particle);
    }
};

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50 + 'px'});
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === HOVER EFFECT FOR SERVICE CARDS ===
const serviceCards = document.querySelectorAll('.service-card, .quality-card-enhanced, .mvv-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// === PARALLAX SCROLL EFFECT ===
let ticking = false;

const parallaxScroll = () => {
    const scrolled = window.pageYOffset;

    // Parallax for hero pattern
    const heroPattern = document.querySelector('.hero-pattern');
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Parallax for shipping section
    const shippingBg = document.querySelector('.shipping-background');
    if (shippingBg) {
        const shippingSection = document.querySelector('.shipping-section');
        const shippingTop = shippingSection.offsetTop;
        const shippingScroll = scrolled - shippingTop;
        if (shippingScroll > -500 && shippingScroll < 1000) {
            shippingBg.style.transform = `translateY(${shippingScroll * 0.3}px)`;
        }
    }

    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(parallaxScroll);
        ticking = true;
    }
});

// === PRELOAD ANIMATIONS ===
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    createParticles();
});

// === BUTTON RIPPLE EFFECT ===
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// === LAZY LOAD IMAGES ===
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        }
    });
});

const lazyImages = document.querySelectorAll('img[data-src]');
lazyImages.forEach(img => imageObserver.observe(img));

console.log('CR Millenium - Site loaded successfully! 🔴⚫');

// === FAQ ACCORDION ===
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other items
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

console.log('CR Millenium - FAQ Accordion loaded! ');
