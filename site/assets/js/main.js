/**
 * Claude Buddy Landing Page JavaScript
 * Handles interactive features and animations
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeInteractions();
    initializeCopyToClipboard();
    initializePersonaCards();
    initializeScrollEffects();
});

/**
 * Initialize theme management
 */
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Smooth transition
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        });
    }
    
    // Check system preference
    if (window.matchMedia && !localStorage.getItem('theme')) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeQuery.matches) {
            body.setAttribute('data-theme', 'dark');
        }
        
        // Listen for system theme changes
        darkModeQuery.addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('nav__menu--active');
            navToggle?.classList.remove('nav__toggle--active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu?.contains(event.target) || navToggle?.contains(event.target);
        if (!isClickInsideNav && navMenu?.classList.contains('nav__menu--active')) {
            navMenu.classList.remove('nav__menu--active');
            navToggle?.classList.remove('nav__toggle--active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize animations and scroll effects
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-block, .persona-card, .install-option, .comparison__card, .integration-card, .flow-item'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate terminal typing effect
    animateTerminal();
}

/**
 * Animate terminal typing effect - Simplified
 */
function animateTerminal() {
    const terminalLines = document.querySelectorAll('.terminal__command');
    
    terminalLines.forEach((line) => {
        // Simple fade in instead of typing effect
        line.style.opacity = '0';
        line.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            line.style.opacity = '1';
        }, 100);
    });
}

// Removed typeText function - no longer needed

/**
 * Initialize interactive features
 */
function initializeInteractions() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (button.hasAttribute('href') && button.getAttribute('href').startsWith('http')) {
            button.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '<span>Loading...</span>';
                
                // Reset after delay (for visual feedback)
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 1000);
            });
        }
    });

    // Add hover effects to feature blocks
    const featureBlocks = document.querySelectorAll('.feature-block');
    featureBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize copy to clipboard functionality
 */
function initializeCopyToClipboard() {
    // Global copy function
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(text);
        }
    };

    // Fallback copy method
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // Add copy functionality to code blocks
    const copyButtons = document.querySelectorAll('.terminal__copy, .code-block__copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const codeElement = this.closest('.terminal, .code-block').querySelector('code, .terminal__command');
            if (codeElement) {
                const text = codeElement.textContent.trim();
                copyToClipboard(text);
            }
        });
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast__content">
            <span class="toast__icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="toast__message">${message}</span>
        </div>
    `;

    // Add toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-danger)' : 'var(--color-accent-primary)',
        color: 'white',
        padding: 'var(--spacing-base) var(--spacing-lg)',
        borderRadius: 'var(--radius-base)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)'
    });

    // Add animation keyframes if not exists
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto remove toast
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 3000);
}

/**
 * Initialize persona card interactions
 */
function initializePersonaCards() {
    const personaCards = document.querySelectorAll('.persona-card');
    
    personaCards.forEach(card => {
        // Add click interaction
        card.addEventListener('click', function() {
            const personaName = this.getAttribute('data-persona');
            if (personaName) {
                showPersonaModal(personaName, this);
            }
        });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('.persona-card__title').textContent}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            // Could add subtle sound effect here
            this.style.transition = 'all 0.2s ease-out';
        });
    });
}

/**
 * Show persona detail modal
 */
function showPersonaModal(personaName, cardElement) {
    const personaData = {
        architect: {
            title: '🏗️ Architect',
            description: 'Systems design, scalability, architecture patterns',
            details: 'The Architect persona specializes in high-level system design, scalability planning, and architectural decision-making. It helps with microservices design, database architecture, API design, and technology selection.',
            examples: [
                '/buddy:architect --comprehensive',
                '/buddy:architect --with-security',
                '/buddy:architect --focus scalability'
            ]
        },
        security: {
            title: '🛡️ Security Expert',
            description: 'Threat modeling, vulnerabilities, compliance',
            details: 'The Security persona focuses on identifying vulnerabilities, implementing security best practices, and ensuring compliance with security standards like OWASP, GDPR, and industry-specific regulations.',
            examples: [
                '/buddy:analyze --persona-security',
                '/buddy:review --focus security',
                '/buddy:improve --persona-security'
            ]
        },
        frontend: {
            title: '🎨 Frontend Expert',
            description: 'UI/UX, accessibility, responsive design',
            details: 'The Frontend persona specializes in user interface development, accessibility standards, responsive design patterns, and modern frontend frameworks. It helps optimize user experience and ensures cross-browser compatibility.',
            examples: [
                '/buddy:analyze --persona-frontend',
                '/buddy:improve --focus accessibility',
                '/buddy:review --persona-frontend'
            ]
        },
        backend: {
            title: '⚙️ Backend Expert',
            description: 'APIs, databases, server reliability',
            details: 'The Backend persona focuses on server-side development, API design, database optimization, and system reliability. It helps with performance tuning, scalability, and implementing robust error handling.',
            examples: [
                '/buddy:analyze --persona-backend',
                '/buddy:architect --focus api-design',
                '/buddy:improve --persona-backend'
            ]
        },
        performance: {
            title: '⚡ Performance Expert',
            description: 'Optimization, bottlenecks, efficiency',
            details: 'The Performance persona specializes in identifying and resolving performance bottlenecks, optimizing code execution, and improving system efficiency. It helps with profiling, caching strategies, and load optimization.',
            examples: [
                '/buddy:analyze --focus performance',
                '/buddy:improve --persona-performance',
                '/buddy:profile --comprehensive'
            ]
        },
        devops: {
            title: '🚀 DevOps Expert',
            description: 'Infrastructure, deployment, observability',
            details: 'The DevOps persona focuses on CI/CD pipelines, infrastructure as code, containerization, and monitoring. It helps streamline deployment processes and ensures system reliability and observability.',
            examples: [
                '/buddy:analyze --persona-devops',
                '/buddy:deploy --check-ready',
                '/buddy:improve --focus ci-cd'
            ]
        },
        qa: {
            title: '🧪 QA Expert',
            description: 'Quality assurance, testing, validation',
            details: 'The QA persona specializes in test strategy, test automation, and quality validation. It helps design comprehensive test suites, identify edge cases, and ensure code reliability through systematic testing.',
            examples: [
                '/buddy:test --comprehensive',
                '/buddy:analyze --persona-qa',
                '/buddy:review --focus testing'
            ]
        },
        analyzer: {
            title: '🔍 Analyzer',
            description: 'Root cause analysis, systematic investigation',
            details: 'The Analyzer persona excels at debugging complex issues, performing root cause analysis, and systematic code investigation. It helps trace bugs, understand code flow, and identify hidden dependencies.',
            examples: [
                '/buddy:analyze --deep',
                '/buddy:debug --comprehensive',
                '/buddy:trace --persona-analyzer'
            ]
        },
        refactorer: {
            title: '🔧 Refactorer',
            description: 'Code quality, technical debt, maintainability',
            details: 'The Refactorer persona focuses on improving code quality, reducing technical debt, and enhancing maintainability. It applies clean code principles, design patterns, and helps modernize legacy code.',
            examples: [
                '/buddy:refactor --comprehensive',
                '/buddy:improve --persona-refactorer',
                '/buddy:analyze --focus maintainability'
            ]
        },
        mentor: {
            title: '👨‍🏫 Mentor',
            description: 'Knowledge transfer, education, guidance',
            details: 'The Mentor persona specializes in explaining complex concepts, providing learning resources, and guiding best practices. It helps junior developers understand code, patterns, and architectural decisions.',
            examples: [
                '/buddy:explain --comprehensive',
                '/buddy:mentor --topic architecture',
                '/buddy:review --educational'
            ]
        },
        scribe: {
            title: '✍️ Scribe',
            description: 'Professional writing, documentation',
            details: 'The Scribe persona excels at creating clear, comprehensive documentation. It helps write README files, API documentation, code comments, and user guides with a focus on clarity and completeness.',
            examples: [
                '/buddy:document --comprehensive',
                '/buddy:commit --detailed',
                '/buddy:readme --professional'
            ]
        },
        po: {
            title: '📋 Product Owner',
            description: 'Product requirements, user stories, strategic planning',
            details: 'The Product Owner persona focuses on translating business needs into technical requirements. It helps create user stories, define acceptance criteria, and align technical decisions with product strategy.',
            examples: [
                '/buddy:requirements --from-idea',
                '/buddy:stories --comprehensive',
                '/buddy:analyze --business-impact'
            ]
        }
    };

    const data = personaData[personaName];
    if (!data) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'persona-modal';
    modal.innerHTML = `
        <div class="persona-modal__overlay" onclick="closePersonaModal()"></div>
        <div class="persona-modal__content">
            <button class="persona-modal__close" onclick="closePersonaModal()" aria-label="Close modal">×</button>
            <div class="persona-modal__header">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            </div>
            <div class="persona-modal__body">
                <p>${data.details}</p>
                <h4>Example Commands:</h4>
                <ul class="persona-modal__examples">
                    ${data.examples.map(example => `<li><code>${example}</code></li>`).join('')}
                </ul>
            </div>
            <div class="persona-modal__footer">
                <a href="https://github.com/gsetsero/claude-buddy#readme" 
                   class="btn btn--primary" target="_blank">Learn More on GitHub</a>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .persona-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }
        .persona-modal__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        .persona-modal__content {
            position: relative;
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-xl);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: var(--spacing-2xl);
            box-shadow: var(--shadow-xl);
            animation: scaleIn 0.3s ease-out;
        }
        .persona-modal__close {
            position: absolute;
            top: var(--spacing-base);
            right: var(--spacing-base);
            background: none;
            border: none;
            color: var(--color-text-secondary);
            font-size: var(--font-size-2xl);
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all var(--transition-base);
        }
        .persona-modal__close:hover {
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
        }
        .persona-modal__header h3 {
            font-size: var(--font-size-2xl);
            margin-bottom: var(--spacing-sm);
        }
        .persona-modal__header p {
            color: var(--color-text-secondary);
            margin-bottom: var(--spacing-lg);
        }
        .persona-modal__body p {
            margin-bottom: var(--spacing-lg);
            line-height: 1.7;
        }
        .persona-modal__body h4 {
            margin-bottom: var(--spacing-base);
            color: var(--color-accent-primary);
        }
        .persona-modal__examples {
            list-style: none;
            margin-bottom: var(--spacing-lg);
        }
        .persona-modal__examples li {
            margin-bottom: var(--spacing-sm);
        }
        .persona-modal__examples code {
            background: var(--color-bg-primary);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            color: var(--color-accent-primary);
        }
        .persona-modal__footer {
            text-align: center;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePersonaModal();
        }
    });

    // Focus trap
    modal.querySelector('.persona-modal__close').focus();
}

/**
 * Close persona modal
 */
window.closePersonaModal = function() {
    const modal = document.querySelector('.persona-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.remove();
            // Remove modal styles
            const modalStyles = document.querySelector('style');
            if (modalStyles && modalStyles.textContent.includes('.persona-modal')) {
                modalStyles.remove();
            }
        }, 300);
    }
};

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        // Header background opacity
        const header = document.querySelector('.header');
        if (header) {
            const opacity = Math.min(scrolled / 100, 1);
            header.style.background = `rgba(10, 10, 10, ${0.8 + opacity * 0.2})`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    // Throttled scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });

    // Scroll to top button
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.setAttribute('aria-label', 'Scroll to top');
    
    Object.assign(scrollToTop.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--color-accent-primary)',
        color: 'white',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        opacity: '0',
        transform: 'translateY(100px)',
        transition: 'all var(--transition-base)',
        zIndex: '1000',
        boxShadow: 'var(--shadow-lg)'
    });

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(scrollToTop);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.transform = 'translateY(0)';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.transform = 'translateY(100px)';
        }
    }, { passive: true });
}

/**
 * Analytics and tracking (placeholder)
 */
function trackEvent(action, category = 'Landing Page') {
    // Implement analytics tracking here
    console.log(`Track: ${category} - ${action}`);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        const text = e.target.textContent.trim();
        trackEvent(`Button Click: ${text}`);
    }
});

/**
 * Performance optimizations
 */
function optimizePerformance() {
    // Lazy load images when they're about to enter viewport
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Preload critical resources
    const criticalLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    criticalLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizePerformance);
} else {
    optimizePerformance();
}

// Service worker registration disabled until sw.js is implemented
// Uncomment below when service worker file is ready
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/