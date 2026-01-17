/**
 * AZ Entreprenør AS - Main JavaScript
 * Handles navigation, forms, animations, and cookie consent
 */

(function() {
    'use strict';

    // =====================================================
    // DOM ELEMENTS
    // =====================================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const declineCookies = document.getElementById('declineCookies');
    const contactForm = document.getElementById('contactForm');

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================
    function toggleMobileNav() {
        const isActive = mobileNav.classList.contains('active');

        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        navOverlay.classList.toggle('active');

        // Update aria-expanded
        menuToggle.setAttribute('aria-expanded', !isActive);

        // Toggle body scroll
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    function closeMobileNav() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileNav);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileNav);
    }

    // Close mobile nav on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    let lastScrollTop = 0;
    const scrollThreshold = 50;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                closeMobileNav();
            }
        });
    });

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================
    if (contactForm) {
        const formMessage = document.getElementById('formMessage');

        function showFormMessage(message, type) {
            formMessage.textContent = message;
            formMessage.className = `form-message show ${type}`;

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function hideFormMessage() {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        function validatePhone(phone) {
            // Norwegian phone number validation
            const cleanPhone = phone.replace(/\s/g, '');
            const phoneRegex = /^(\+47)?[2-9]\d{7}$/;
            return phoneRegex.test(cleanPhone);
        }

        function setFieldError(fieldId, hasError) {
            const field = document.getElementById(fieldId);
            const formGroup = field.closest('.form-group');

            if (hasError) {
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideFormMessage();

            // Get form values
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const projectType = document.getElementById('projectType');
            const message = document.getElementById('message');

            let hasErrors = false;

            // Validate name
            if (!name.value.trim()) {
                setFieldError('name', true);
                hasErrors = true;
            } else {
                setFieldError('name', false);
            }

            // Validate email
            if (!validateEmail(email.value)) {
                setFieldError('email', true);
                hasErrors = true;
            } else {
                setFieldError('email', false);
            }

            // Validate phone
            if (!validatePhone(phone.value)) {
                setFieldError('phone', true);
                hasErrors = true;
            } else {
                setFieldError('phone', false);
            }

            // Validate message
            if (!message.value.trim()) {
                setFieldError('message', true);
                hasErrors = true;
            } else {
                setFieldError('message', false);
            }

            if (hasErrors) {
                showFormMessage('Vennligst fyll ut alle påkrevde felt korrekt.', 'error');
                return;
            }

            // Prepare form data
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                projectType: projectType.value,
                message: message.value.trim()
            };

            // Disable submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sender...';

            try {
                // Simulate API call (replace with actual Resend API integration)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showFormMessage(
                    'Takk for din henvendelse! Vi har mottatt meldingen din og vil svare deg så snart som mulig, vanligvis innen 24 timer.',
                    'success'
                );

                // Reset form
                contactForm.reset();

                // Log form data (for development)
                console.log('Form submitted:', formData);

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(
                    'Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte på telefon.',
                    'error'
                );
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });

        // Clear field error on input
        const formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                formGroup.classList.remove('error');
            });
        });
    }

    // =====================================================
    // COOKIE CONSENT
    // =====================================================
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    }

    function showCookieBanner() {
        if (cookieBanner) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    }

    function handleCookieConsent() {
        const consent = getCookie('cookie_consent');

        if (!consent) {
            showCookieBanner();
        }
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            setCookie('cookie_consent', 'accepted', 365);
            hideCookieBanner();
            // Initialize analytics or other tracking here
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            setCookie('cookie_consent', 'declined', 365);
            hideCookieBanner();
        });
    }

    // Initialize cookie consent check
    handleCookieConsent();

    // =====================================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // =====================================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    // =====================================================
    // PHONE NUMBER FORMATTING
    // =====================================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Remove country code if present
            if (value.startsWith('47')) {
                value = value.substring(2);
            }

            // Format as XXX XX XXX
            if (value.length > 3 && value.length <= 5) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            } else if (value.length > 5) {
                value = value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8);
            }

            e.target.value = value;
        });
    }

    // =====================================================
    // GALLERY FILTER (for future use)
    // =====================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.dataset.filter;

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // =====================================================
    // ACTIVE PAGE HIGHLIGHTING
    // =====================================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // =====================================================
    // LAZY LOADING IMAGES
    // =====================================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // =====================================================
    // PRINT STYLING
    // =====================================================
    window.addEventListener('beforeprint', () => {
        // Expand any collapsed sections before printing
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    });

    // =====================================================
    // CONSOLE LOG
    // =====================================================
    console.log(
        '%c AZ Entreprenør AS ',
        'background: #E07B39; color: white; font-size: 20px; padding: 10px;'
    );
    console.log(
        '%c Din lokale ekspert på gulvlegging og flisarbeid ',
        'color: #2D2D2D; font-size: 14px;'
    );

})();
