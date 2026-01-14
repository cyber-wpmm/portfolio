// signed: serozr
/*
    File: main.js
    Purpose: handles observers and UI interactions
    Signed by: serozr
*/

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// === Counter Animation for Stats ===
function animateCounter(element, target, suffix = '') {
    const duration = 800;
    const start = 0;
    const startTime = performance.now();
    
    element.classList.add('counting');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
            element.classList.remove('counting');
        }
    }
    
    requestAnimationFrame(update);
}

// Observer for stat counters
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent.trim();
                const hasPlus = text.includes('+');
                const number = parseInt(text.replace('+', ''));
                
                if (!isNaN(number)) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, number, hasPlus ? '+' : '');
                    }, index * 200);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the about-stats container
document.querySelectorAll('.about-stats').forEach(stats => {
    statsObserver.observe(stats);
});

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('lazy-section');
        lazyObserver.observe(section);
    });
});

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        document.body.style.overflowY = 'auto';
    }, 150);
}, { passive: true });


// PDF Modal logic for certificates and education cards with next/prev for Griffith College
import { griffithAwards } from './griffithAwards.js';
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfIframe');
    const prevBtn = document.getElementById('prevPdfBtn');
    const nextBtn = document.getElementById('nextPdfBtn');
    const navHint = document.getElementById('pdfNavHint');
    const overlayPrev = document.getElementById('pdfOverlayPrev');
    const overlayNext = document.getElementById('pdfOverlayNext');
    let currentAwardIdx = 0;
    let isGriffith = false;

    // Helper to show PDF by index
    function showGriffithPdf(idx) {
        if (griffithAwards.length === 0) return;
        currentAwardIdx = ((idx % griffithAwards.length) + griffithAwards.length) % griffithAwards.length;
        iframe.src = griffithAwards[currentAwardIdx];
        // Show/hide arrows and hint only for Griffith
        if (prevBtn && nextBtn) {
            prevBtn.style.display = nextBtn.style.display = 'inline-block';
        }
        if (overlayPrev && overlayNext) {
            overlayPrev.style.display = overlayNext.style.display = 'inline-block';
        }
        if (navHint) {
            navHint.style.display = griffithAwards.length > 1 ? 'block' : 'none';
        }
    }

    // Attach click listeners to all .cert-link and .education-link elements
    document.querySelectorAll('.cert-link, .education-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfUrl = this.getAttribute('data-pdf') || this.getAttribute('href');
            // If this is the Griffith College card, enable navigation
            if (this.querySelector('.education-school') && this.querySelector('.education-school').textContent.includes('Griffith College')) {
                isGriffith = true;
                // Find index in griffithAwards
                let idx = griffithAwards.findIndex(p => p === pdfUrl);
                if (idx === -1) idx = 0;
                showGriffithPdf(idx);
            } else {
                isGriffith = false;
                iframe.src = pdfUrl;
                if (prevBtn && nextBtn) {
                    prevBtn.style.display = nextBtn.style.display = 'none';
                }
                if (overlayPrev && overlayNext) {
                    overlayPrev.style.display = overlayNext.style.display = 'none';
                }
                if (navHint) navHint.style.display = 'none';
            }
            modal.style.display = 'flex';
        });
    });

    // Next/Prev navigation for Griffith awards (all arrow buttons)
    function handlePrev(e) {
        e.stopPropagation();
        if (isGriffith) showGriffithPdf(currentAwardIdx - 1);
    }
    function handleNext(e) {
        e.stopPropagation();
        if (isGriffith) showGriffithPdf(currentAwardIdx + 1);
    }
    if (prevBtn) prevBtn.addEventListener('click', handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);
    if (overlayPrev) overlayPrev.addEventListener('click', handlePrev);
    if (overlayNext) overlayNext.addEventListener('click', handleNext);

    // Close modal when clicking outside content or on close button
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                iframe.src = '';
            }
        });
    }
    const closeBtn = document.querySelector('.close-pdf-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            iframe.src = '';
        });
    }
});
// End of file - signed: serozr
