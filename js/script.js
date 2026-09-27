/**
 * ==========================================================================
 * AHMED HAMDY - FLUTTER DEVELOPER PORTFOLIO
 * Vanilla JavaScript Engine: Theme, Navigation, A11y, Scroll Spy, Form
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. THEME ENGINE (Dark / Light Mode & LocalStorage Persistence)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default based on system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('ahmed_portfolio_theme');
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlRoot.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Theme');
        themeToggleBtn.setAttribute('aria-pressed', 'true');
      }
    } else {
      htmlRoot.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Theme');
        themeToggleBtn.setAttribute('aria-pressed', 'false');
      }
    }
    localStorage.setItem('ahmed_portfolio_theme', theme);
  };

  // Initialize theme
  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  // Toggle theme on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  // Listen to OS system color-scheme changes if no explicit user override is stored
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('ahmed_portfolio_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    if (mobileMenuBtn && navLinksList) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      navLinksList.classList.add('open');
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenuBtn && navLinksList) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      navLinksList.classList.remove('open');
    }
  };

  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksList.classList.contains('open')) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. STICKY HEADER & SCROLL EFFECTS
  // ------------------------------------------------------------------------
  const header = document.querySelector('.header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollEffects = () => {
    const scrollY = window.scrollY;

    // Header compact effect
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. SCROLL SPY: ACTIVE NAV LINK HIGHLIGHTING
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }
  );

  sections.forEach((sec) => scrollSpyObserver.observe(sec));

  // ------------------------------------------------------------------------
  // 5. INTERSECTION OBSERVER: SCROLL REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once for high performance
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // ------------------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & CLIENT-SIDE FEEDBACK
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const statusAlert = document.getElementById('form-status-alert');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Clear live errors on user typing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        nameInput.classList.remove('invalid');
        if (nameError) nameError.classList.remove('visible');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('invalid');
        if (emailError) emailError.classList.remove('visible');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        messageInput.classList.remove('invalid');
        if (messageError) messageError.classList.remove('visible');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (nameVal.length < 2) {
        isValid = false;
        if (nameInput) nameInput.classList.add('invalid');
        if (nameError) nameError.classList.add('visible');
      } else {
        if (nameInput) nameInput.classList.remove('invalid');
        if (nameError) nameError.classList.remove('visible');
      }

      // Validate Email
      if (!emailRegex.test(emailVal)) {
        isValid = false;
        if (emailInput) emailInput.classList.add('invalid');
        if (emailError) emailError.classList.add('visible');
      } else {
        if (emailInput) emailInput.classList.remove('invalid');
        if (emailError) emailError.classList.remove('visible');
      }

      // Validate Message
      if (messageVal.length < 10) {
        isValid = false;
        if (messageInput) messageInput.classList.add('invalid');
        if (messageError) messageError.classList.add('visible');
      } else {
        if (messageInput) messageInput.classList.remove('invalid');
        if (messageError) messageError.classList.remove('visible');
      }

      if (!isValid) {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert error';
          statusAlert.textContent = 'Please fill out all required fields with valid information.';
        }
        return;
      }

      // Simulation of submission: Form is client-side validated and ready for backend integration
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Sending...
        `;
      }

      setTimeout(() => {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert success';
          statusAlert.innerHTML = `
            <strong>Thank you, ${nameVal}!</strong> Your message has been prepared successfully.<br>
            <span style="font-size: 0.85em; opacity: 0.9;">(This is a verified client-side demonstration. You can also contact Ahmed directly at <a href="mailto:ahmedhamdy44vv@gmail.com" style="text-decoration: underline; font-weight: bold;">ahmedhamdy44vv@gmail.com</a>)</span>
          `;
        }

        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Auto hide success after 10 seconds
        setTimeout(() => {
          if (statusAlert && statusAlert.classList.contains('success')) {
            statusAlert.className = 'form-status-alert';
            statusAlert.textContent = '';
          }
        }, 10000);
      }, 700);
    });
  }
});
