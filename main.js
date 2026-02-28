/**
 * LOFTUS ELITE ROOFING - MAIN JAVASCRIPT
 * Industrial Enterprise Design System
 * Production-ready interaction handlers
 */

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

// ==========================================================================
// SMOOTH SCROLL WITH OFFSET FOR FIXED HEADER
// ==========================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for empty hash or just #
        if (href === '#' || href === '') {
            return;
        }
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = 90; // Fixed header height
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================================
// ACTIVE NAVIGATION STATE
// ==========================================================================

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 150; // Offset for better trigger point
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================================================
// HEADER SHADOW ON SCROLL
// ==========================================================================

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.classList.add('shadow-lg');
        header.classList.remove('shadow-sm');
    } else {
        header.classList.add('shadow-sm');
        header.classList.remove('shadow-lg');
    }
});

// ==========================================================================
// FORM SUBMISSION HANDLER
// ==========================================================================

const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> SENDING...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Success state
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> REQUEST SENT!';
            submitBtn.classList.remove('bg-brand');
            submitBtn.classList.add('bg-green-600');
            
            // Show success message
            showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
            
            // Reset form
            quoteForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-green-600');
                submitBtn.classList.add('bg-brand');
            }, 3000);
            
        }, 1500);
        
        // In production, replace the setTimeout above with actual form submission:
        /*
        fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
            quoteForm.reset();
        })
        .catch(error => {
            showNotification('Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
        */
    });
}

// ==========================================================================
// NOTIFICATION SYSTEM
// ==========================================================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-24 right-6 z-50 px-6 py-4 shadow-lg transform translate-x-0 transition-all duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 
        'bg-blue-600'
    } text-white max-w-md`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } text-2xl"></i>
            <p class="font-semibold">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto focus:outline-none">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==========================================================================
// LAZY LOADING IMAGES (NATIVE)
// ==========================================================================

// Modern browsers support native lazy loading via loading="lazy" attribute
// This is a fallback for older browsers

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================================================
// PERFORMANCE MONITORING (OPTIONAL)
// ==========================================================================

// Log Core Web Vitals for performance optimization
if ('PerformanceObserver' in window) {
    try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
        
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({entryTypes: ['first-input']});
        
    } catch (e) {
        // Performance monitoring not supported
    }
}

// ==========================================================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================================================

// Add keyboard navigation support for cards
document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('a');
            if (link) {
                link.click();
            }
        }
    });
});

// ==========================================================================
// CONSOLE BRANDING (OPTIONAL)
// ==========================================================================

// ==========================================================================
// TESTIMONIAL EXPAND/COLLAPSE
// ==========================================================================

function toggleTestimonial(button) {
    const card = button.closest('.testimonial-card');
    const textDiv = card.querySelector('.testimonial-text');
    
    card.classList.toggle('expanded');
    
    if (card.classList.contains('expanded')) {
        button.innerHTML = 'Read Less <i class="fas fa-chevron-down"></i>';
    } else {
        button.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
    }
}

// ==========================================================================
// OUR PROCESS - PROGRESSIVE RED LINE ANIMATION
// ==========================================================================

// Add hover interactions to process steps
document.addEventListener('DOMContentLoaded', function() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            // Calculate progress percentage based on step position
            const progressPercentage = ((index + 1) / processSteps.length) * 100;
            
            // Animate the red line to the current step
            const progressLine = document.getElementById('progress-line-1');
            if (progressLine) {
                progressLine.style.width = progressPercentage + '%';
            }
        });
    });
    
    // Reset line on mouse leave from section
    const processSection = document.getElementById('process');
    if (processSection) {
        processSection.addEventListener('mouseleave', function() {
            const progressLine = document.getElementById('progress-line-1');
            if (progressLine) {
                progressLine.style.width = '0%';
            }
        });
    }
});

// ==========================================================================
// ACCORDION TOGGLE (ASSET LONGEVITY GUIDE)
// ==========================================================================

function toggleAccordion(button) {
    const item = button.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const icon = button.querySelector('.accordion-icon');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Close all other accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        if (header !== button) {
            header.setAttribute('aria-expanded', 'false');
            const otherContent = header.closest('.accordion-item').querySelector('.accordion-content');
            otherContent.classList.remove('open');
            otherContent.style.maxHeight = '0';
        }
    });
    
    // Toggle current accordion
    if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        content.classList.remove('open');
        content.style.maxHeight = '0';
    } else {
        button.setAttribute('aria-expanded', 'true');
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}

// ==========================================================================
// CONSOLE BRANDING (OPTIONAL)
// ==========================================================================

console.log(
    '%c LOFTUS ELITE ROOFING AND GC SERVICES ',
    'background: #A82020; color: white; font-size: 20px; font-weight: bold; padding: 10px;'
);
console.log(
    '%c Expert Craftsmanship • Modern Engineering ',
    'color: #1F2937; font-size: 14px; font-weight: 600;'
);
